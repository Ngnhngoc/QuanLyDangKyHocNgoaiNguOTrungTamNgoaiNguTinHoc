using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;
using System;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LopHocController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public LopHocController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // 1. GET: api/LopHoc
[HttpGet]
public async Task<IActionResult> GetLichKhaiGiang()
{
    try 
    {
        var lichHoc = await (from lop in _context.Lophocs
                             join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                             join gv in _context.Giangviens on lop.Magv equals gv.Magv into gvGroup
                             from gv in gvGroup.DefaultIfEmpty()
                             select new
                             {
                                 maLop = lop.Malop,
                                 tenLop = lop.Tenlop,
                                 maKH = lop.Makh,
                                 tenKH = kh.Tenkh,
                                 maGV = lop.Magv, 
                                 tenGV = gv != null ? gv.Tennv : "Chưa phân công",
                                 tongCho = lop.Soluong ?? 0,
                                 buoiHoc = lop.Ngayhoc ?? "Chưa xếp",
                                 gioHoc = lop.Giohoc ?? "Chưa xếp",
                                 tenKhoaHoc = kh.Tenkh + " (" + lop.Tenlop + ")",
                                 siSo = lop.Siso ?? 0,
                                 daGhiDanh = lop.Siso ?? 0,
                                 ngayKhaiGiang = lop.Ngaybdhoc.HasValue ? lop.Ngaybdhoc.Value.ToString("dd/MM/yyyy") : "Đang cập nhật",
                                 tinhTrang = (lop.Soluong - lop.Siso <= 5) ? "Gần hết chỗ" : "Đang tuyển"
                             }).ToListAsync();

        return Ok(lichHoc);
    }
    catch (Exception ex)
    {
        // Khi chạy trên trình duyệt, em sẽ thấy lỗi này hiện ra thay vì "undefined"
        return StatusCode(500, new { message = ex.Message });
    }
}

        // 2. GET: api/LopHoc/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLopHocById(string id)
        {
            var lop = await _context.Lophocs.FindAsync(id);
            if (lop == null) return NotFound("Không tìm thấy lớp học.");
            return Ok(lop);
        }

        // 3. POST: api/LopHoc (Thêm mới 1 lớp học từ trang Admin - ĐÃ ĐẦY ĐỦ TRƯỜNG)
        [HttpPost]
        public async Task<IActionResult> AddLopHoc([FromBody] LopHocFormDto lopDto)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var lopMoi = new Lophoc 
            {
                Malop = lopDto.Malop,
                Tenlop = lopDto.Tenlop!,
                Makh = lopDto.Makh!,
                Magv = lopDto.Magv,
                Siso = lopDto.Siso ?? 0,
                // 👉 Lấy đủ 4 trường mới
                Soluong = lopDto.Soluong,
                Ngayhoc = lopDto.Ngayhoc,
                Giohoc = lopDto.Giohoc,
                Ngaybdhoc = lopDto.Ngaybdhoc
            };

            try
            {
                _context.Lophocs.Add(lopMoi);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thêm lớp học thành công!", data = lopMoi });
            }
            catch (Exception ex)
            {
                var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi SQL: {errorDetail}");
            }
        }

        // 4. PUT: api/LopHoc/{id} (Cập nhật - ĐÃ ĐẦY ĐỦ TRƯỜNG)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLopHoc(string id, [FromBody] LopHocFormDto lopDto)
        {
            if (id != lopDto.Malop) return BadRequest("Mã lớp học không khớp.");

            var lopCu = await _context.Lophocs.FindAsync(id);
            if (lopCu == null) return NotFound("Không tìm thấy lớp học để sửa.");

            lopCu.Tenlop = lopDto.Tenlop!;
            lopCu.Makh = lopDto.Makh!;
            lopCu.Magv = lopDto.Magv;
            if (lopDto.Siso.HasValue) lopCu.Siso = lopDto.Siso.Value;

            // 👉 Cập nhật đủ 4 trường mới
            lopCu.Soluong = lopDto.Soluong;
            lopCu.Ngayhoc = lopDto.Ngayhoc;
            lopCu.Giohoc = lopDto.Giohoc;
            lopCu.Ngaybdhoc = lopDto.Ngaybdhoc;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật lớp học thành công!" });
            }
            catch (Exception ex)
            {
                var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi SQL: {errorDetail}");
            }
        }

        // 5. DELETE: api/LopHoc/{id} (Hủy lớp học)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLopHoc(string id)
        {
            var lop = await _context.Lophocs.FindAsync(id);
            if (lop == null) return NotFound("Không tìm thấy lớp học.");

            try
            {
                _context.Lophocs.Remove(lop);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã hủy lớp học thành công." });
            }
            catch (DbUpdateException)
            {
                return StatusCode(409, new { message = "Không thể xóa lớp học đang có đăng ký hoặc phiếu thanh toán." });
            }
        }

        // 6. GET: api/LopHoc/{maLop}/HocVien (Lấy danh sách học viên THẬT của lớp)
        [HttpGet("{maLop}/HocVien")]
        public async Task<IActionResult> GetHocVienByLop(string maLop)
        {
            var dsHocVien = await (from dk in _context.Dangkies
                                   join hv in _context.Hocviens on dk.Mahv equals hv.Mahv
                                   where dk.Malop == maLop && dk.TrangThai == 1
                                   select new
                                   {
                                       maHV = hv.Mahv,
                                       tenHV = hv.Hotenhv, // Nếu cột tên trong CSDL của em viết khác (vd: Tennv, Hoten), hãy sửa lại cho khớp
                                       sdt = hv.Dienthoaihv,   // Sửa lại theo tên cột trong bảng HOCVIEN của em nếu có lệch
                                       email = hv.Emailhv
                                   }).ToListAsync();

            return Ok(dsHocVien);
        }

        // 7. DELETE: api/LopHoc/{maLop}/HocVien/{maHv} (Xóa học viên khỏi lớp)
        [HttpDelete("{maLop}/HocVien/{maHv}")]
        public async Task<IActionResult> RemoveHocVienFromLop(string maLop, string maHv)
        {
            // Tìm bản ghi đăng ký của học viên trong lớp đó
            var dangKy = await _context.Dangkies
                .FirstOrDefaultAsync(dk => dk.Malop == maLop && dk.Mahv == maHv);

            if (dangKy == null) return NotFound(new { message = "Học viên chưa đăng ký lớp này." });

            try
            {
                // 1. Xóa bản ghi ở bảng DANGKY
                _context.Dangkies.Remove(dangKy);

                // 2. Tự động trừ Sĩ số (Siso) của lớp học đó đi 1
                var lop = await _context.Lophocs.FindAsync(maLop);
                if (lop != null && dangKy.TrangThai == 1 && lop.Siso > 0)
                {
                    lop.Siso -= 1;
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã xóa học viên khỏi lớp thành công!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
            }
        }
    }

    

    // LỚP DTO TRUNG GIAN ĐỂ NHẬN DỮ LIỆU TỪ REACT & HIỆN TRÊN SWAGGER
    public class LopHocFormDto
    {
        public string Malop { get; set; } = string.Empty;
        public string? Tenlop { get; set; }
        public string? Makh { get; set; }
        public string? Magv { get; set; }
        public int? Siso { get; set; }
        
        // 👉 ĐÃ BỔ SUNG ĐỂ SWAGGER NHẬN DIỆN ĐƯỢC
        public int? Soluong { get; set; } 
        public string? Ngayhoc { get; set; } 
        public string? Giohoc { get; set; }
        public DateTime? Ngaybdhoc { get; set; } 
    }
}
