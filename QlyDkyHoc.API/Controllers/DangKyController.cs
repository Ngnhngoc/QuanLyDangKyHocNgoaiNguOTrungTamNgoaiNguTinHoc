using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;
using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DangKyController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public DangKyController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // 1. GET: Lấy danh sách học viên đang "Chờ duyệt" (TrangThai == 0 hoặc null)
        [HttpGet("ChoDuyet")]
        public async Task<IActionResult> GetDanhSachChoDuyet()
        {
            var dsChoDuyet = await (from dk in _context.Dangkies
                                    join hv in _context.Hocviens on dk.Mahv equals hv.Mahv
                                    join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                    // Lọc những đơn chưa duyệt (Giả định 0 là chưa duyệt. Nếu em dùng chữ thì đổi thành dk.TrangThai == "Chờ duyệt")
                                    where dk.TrangThai == 0 || dk.TrangThai == null 
                                    select new
                                    {
                                        maHv = hv.Mahv,
                                        tenHv = hv.Hotenhv,
                                        sdt = hv.Dienthoaihv,
                                        maLop = lop.Malop,
                                        tenLop = lop.Tenlop,
                                        ngayDangKy = dk.Ngaydangky.HasValue ? dk.Ngaydangky.Value.ToString("dd/MM/yyyy HH:mm") : "Vừa xong"
                                    }).ToListAsync();

            return Ok(dsChoDuyet);
        }

        // 2. PUT: Xử lý khi Admin bấm "Duyệt"
        [HttpPut("Duyet/{maHv}/{maLop}")]
        public async Task<IActionResult> DuyetHocVien(string maHv, string maLop)
        {
            // 1. Tìm bản ghi đăng ký
            var dangKy = await _context.Dangkies.FirstOrDefaultAsync(dk => dk.Mahv == maHv && dk.Malop == maLop);
            if (dangKy == null) return NotFound(new { message = "Không tìm thấy phiếu đăng ký." });

            // 2. Tìm lớp học để tăng sĩ số
            var lop = await _context.Lophocs.FindAsync(maLop);
            if (lop == null) return NotFound(new { message = "Không tìm thấy thông tin lớp học." });

            // Kiểm tra xem lớp đã đầy chưa
            if (lop.Siso >= lop.Soluong) 
                return BadRequest(new { message = "Lớp học này đã đủ số lượng tối đa!" });

            try
            {
                // Cập nhật trạng thái thành Đã duyệt (Đổi "1" thành kiểu int hoặc string tùy database của em)
                dangKy.TrangThai = 1; 

                // Tăng sĩ số lớp lên 1
                lop.Siso = (lop.Siso ?? 0) + 1;

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã duyệt thành công! Học viên đã được thêm vào lớp." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        // 3. DELETE: Xử lý khi Admin bấm "Từ chối / Hủy"
        [HttpDelete("TuChoi/{maHv}/{maLop}")]
        public async Task<IActionResult> TuChoiHocVien(string maHv, string maLop)
        {
            var dangKy = await _context.Dangkies.FirstOrDefaultAsync(dk => dk.Mahv == maHv && dk.Malop == maLop);
            if (dangKy == null) return NotFound(new { message = "Không tìm thấy phiếu đăng ký." });

            try
            {
                _context.Dangkies.Remove(dangKy); // Xóa hẳn phiếu đăng ký
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã từ chối và hủy phiếu đăng ký." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }

        // 4. POST: api/DangKy (Học viên bấm Ghi danh lớp học)
        // 👉 Nhớ đảm bảo trên cùng của file đã có dòng này:
        // using Microsoft.EntityFrameworkCore;

        [HttpPost]
        public async Task<IActionResult> DangKyLop([FromBody] GhiDanhDto dto)
        {
            // Kiểm tra dữ liệu đầu vào
            if (string.IsNullOrEmpty(dto.Mahv) || string.IsNullOrEmpty(dto.Malop))
                return BadRequest(new { message = "Lỗi: Mã học viên hoặc Mã lớp bị trống!" });

            try
            {
                // Vẫn dùng EF Core để SELECT (vì Select không bị lỗi thêm cột)
                var daDangKy = await _context.Dangkies.AnyAsync(x => x.Mahv == dto.Mahv && x.Malop == dto.Malop);
                if (daDangKy) return BadRequest(new { message = "Bạn đã đăng ký lớp này rồi, đang chờ duyệt!" });

                // 🔥 TUYỆT CHIÊU CUỐI: Dùng Raw SQL để Insert thẳng vào DB!
                // Ép hệ thống chạy lệnh SQL thuần túy, cấm EF Core tự động sinh thêm cột ảo.
                string sql = "INSERT INTO DANGKY (MAHV, MALOP, TRANGTHAI, NGAYDANGKY) VALUES ({0}, {1}, 0, GETDATE())";
                await _context.Database.ExecuteSqlRawAsync(sql, dto.Mahv, dto.Malop);

                return Ok(new { message = "Ghi danh thành công! Vui lòng chờ trung tâm duyệt." });
            }
            catch (Exception ex)
            {
                // Thay đổi lời nhắn để xác nhận code mới đã được nạp
                return StatusCode(500, new { message = $"Lỗi Ma Ám: {ex.Message}" });
            }
        }

        // 5. GET: api/DangKy/LichHocCuaToi/{mahv}
        [HttpGet("LichHocCuaToi/{mahv}")]
        public async Task<IActionResult> GetLichHocCuaToi(string mahv)
        {
            var lichHoc = await (from dk in _context.Dangkies
                                 join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                 join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                 where dk.Mahv == mahv
                                 select new
                                 {
                                     maLop = lop.Malop,
                                     tenLop = lop.Tenlop,
                                     tenKhoaHoc = kh.Tenkh,
                                     ngayKhaiGiang = lop.Ngaybdhoc.HasValue ? lop.Ngaybdhoc.Value.ToString("dd/MM/yyyy") : "Đang cập nhật",
                                     buoiHoc = lop.Ngayhoc ?? "Chưa xếp",
                                     gioHoc = lop.Giohoc ?? "Chưa xếp",
                                     phongHoc = "Tầng 2 - Cơ sở 1", // Tạm thời hardcode hoặc lấy từ DB nếu em có
                                     trangThai = dk.TrangThai == 1 ? "Đã duyệt" : "Đang chờ duyệt"
                                 }).ToListAsync();

            return Ok(lichHoc);
        }

        // 6. GET: api/DangKy/HocPhiCuaToi/{mahv}
        [HttpGet("HocPhiCuaToi/{mahv}")]
        public async Task<IActionResult> GetHocPhiCuaToi(string mahv)
        {
            try
            {
                var hocPhiList = await (from dk in _context.Dangkies
                                        join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                        join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                        where dk.Mahv == mahv
                                        select new
                                        {
                                            maLop = lop.Malop,
                                            tenKhoaHoc = kh.Tenkh,
                                            tenLop = lop.Tenlop,
                                            ngayDangKy = dk.Ngaydangky,
                                            hocPhi = kh.Hocphi ?? 0, // Lấy học phí từ bảng Khóa Học
                                            trangThai = dk.TrangThai // 0: Chưa thanh toán, 1: Đã thanh toán
                                        }).ToListAsync();

                return Ok(hocPhiList);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi truy xuất dữ liệu: {ex.Message}" });
            }
        }

        // Lớp DTO trung gian chỉ nhận đúng 2 thông tin từ React gửi lên
    public class GhiDanhDto
{
    [JsonPropertyName("mahv")] // Ép nó hiểu "mahv" từ React gửi lên là Mahv
    public string Mahv { get; set; } = string.Empty;

    [JsonPropertyName("malop")] // Ép nó hiểu "malop" từ React gửi lên là Malop
    public string Malop { get; set; } = string.Empty;
}
    }
}