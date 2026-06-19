using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GiangVienController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public GiangVienController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // 1. GET: api/GiangVien (Lấy danh sách để hiện lên React)
        [HttpGet]
        public async Task<IActionResult> GetAllGiangVien()
        {
            var dsGiangVien = await _context.Giangviens
                .Select(gv => new
                {
                    maGV = gv.Magv,
                    tennv = gv.Tennv,
                    chuyenmon = gv.Chuyenmon, // Ngôn ngữ giảng dạy
                    sdtnv = gv.Sdtnv,
                    emailnv = gv.Emailnv,
                    hinhanh = gv.Hinhanh
                })
                .ToListAsync();

            if (!dsGiangVien.Any()) return NotFound("Chưa có giảng viên nào.");
            return Ok(dsGiangVien);
        }

        // 2. GET: api/GiangVien/{id} (Lấy thông tin 1 giảng viên để làm chức năng Sửa)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetGiangVienById(string id)
        {
            var gv = await _context.Giangviens.FindAsync(id);
            if (gv == null) return NotFound("Không tìm thấy giảng viên.");
            return Ok(gv);
        }

        // 3. POST: api/GiangVien (Thêm mới)
        [HttpPost]
        public async Task<IActionResult> AddGiangVien([FromBody] Giangvien gv)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            try
            {
                _context.Giangviens.Add(gv);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thêm giảng viên thành công!", data = gv });
            }
            catch (Exception ex)
            {
                var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi SQL: {errorDetail}");
            }
        }

        // 4. PUT: api/GiangVien/{id} (SỬA THÔNG TIN - Hàm em đang thiếu)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateGiangVien(string id, [FromBody] Giangvien gv)
        {
            if (id != gv.Magv) return BadRequest("Mã giảng viên không khớp.");

            _context.Entry(gv).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Giangviens.Any(e => e.Magv == id))
                    return NotFound("Không tìm thấy giảng viên để sửa.");
                else throw;
            }

            return Ok(new { message = "Cập nhật giảng viên thành công!" });
        }



        public class GiangVienLoginRequest
        {
            public string Username { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginGiangVien([FromBody] GiangVienLoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ tài khoản và mật khẩu." });

            var giangVien = await _context.Giangviens
                .FirstOrDefaultAsync(gv => gv.Magv == request.Username && gv.Matkhaunv == request.Password);

            if (giangVien == null)
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu giảng viên!" });

            return Ok(new
            {
                message = "Đăng nhập giảng viên thành công!",
                role = "giangvien",
                user = new
                {
                    magv = giangVien.Magv,
                    tennv = giangVien.Tennv,
                    chuyenmon = giangVien.Chuyenmon,
                    emailnv = giangVien.Emailnv,
                    sdtnv = giangVien.Sdtnv
                }
            });
        }

        [HttpGet("{id}/lop-duoc-phan-cong")]
        public async Task<IActionResult> GetLopDuocPhanCong(string id)
        {
            var giangVien = await _context.Giangviens.FindAsync(id);
            if (giangVien == null) return NotFound(new { message = "Không tìm thấy giảng viên." });

            var danhSachLop = await (from lop in _context.Lophocs
                                     join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                     where lop.Magv == id
                                     orderby lop.Ngaybdhoc
                                     select new
                                     {
                                         maLop = lop.Malop,
                                         tenLop = lop.Tenlop,
                                         maKhoaHoc = kh.Makh,
                                         tenKhoaHoc = kh.Tenkh,
                                         ngayKhaiGiang = lop.Ngaybdhoc,
                                         buoiHoc = lop.Ngayhoc,
                                         gioHoc = lop.Giohoc,
                                         siSo = lop.Siso ?? 0,
                                         tongCho = lop.Soluong ?? 0,
                                         soHocVienDaDuyet = _context.Dangkies.Count(dk => dk.Malop == lop.Malop && dk.TrangThai == 1)
                                     }).ToListAsync();

            return Ok(danhSachLop);
        }

        [HttpGet("{id}/hoc-vien")]
        public async Task<IActionResult> GetHocVienTheoGiangVien(string id)
        {
            var giangVien = await _context.Giangviens.FindAsync(id);
            if (giangVien == null) return NotFound(new { message = "Không tìm thấy giảng viên." });

            var danhSach = await (from lop in _context.Lophocs
                                  join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                  join dk in _context.Dangkies on lop.Malop equals dk.Malop
                                  join hv in _context.Hocviens on dk.Mahv equals hv.Mahv
                                  where lop.Magv == id && dk.TrangThai == 1
                                  orderby lop.Malop, hv.Hotenhv
                                  select new
                                  {
                                      maLop = lop.Malop,
                                      tenLop = lop.Tenlop,
                                      tenKhoaHoc = kh.Tenkh,
                                      maHocVien = hv.Mahv,
                                      tenHocVien = hv.Hotenhv,
                                      sdt = hv.Dienthoaihv,
                                      email = hv.Emailhv
                                  }).ToListAsync();

            return Ok(danhSach);
        }

        // 5. DELETE: api/GiangVien/{id} (Xóa)
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteGiangVien(string id)
{
    var gv = await _context.Giangviens.FindAsync(id);
    if (gv == null) return NotFound(new { message = "Không tìm thấy giảng viên." });

    try
    {
        // Thử xóa Giảng viên
        _context.Giangviens.Remove(gv);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Đã xóa giảng viên thành công." });
    }
    catch (DbUpdateException)
    {
        // SQL Server chặn lại vì Giảng viên đang có khóa ngoại dính với Lớp học
        // Trả về mã lỗi 409 (Conflict) cùng lời nhắn đàng hoàng
        return StatusCode(409, new { message = "Không thể xóa! Giảng viên này đang được phân công giảng dạy." });
    }
    catch (Exception ex)
    {
        // Bắt các lỗi hệ thống khác
        return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
    }
}
    }
}