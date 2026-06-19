using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanvienController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public NhanvienController(QlyDkyHocContext context)
        {
            _context = context;
        }

        public class AdminLoginRequest
        {
            public string Username { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        [HttpPost("login")]
        public async Task<IActionResult> LoginAdmin([FromBody] AdminLoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ tài khoản và mật khẩu." });

            var admin = await _context.Nhanviens
                .FirstOrDefaultAsync(n => n.Manv2 == request.Username && n.Matkhaunv == request.Password);

            if (admin == null)
            {
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu Quản trị!" });
            }

            return Ok(new
            {
                message = "Đăng nhập Admin thành công!",
                role = "admin",
                user = new { manv = admin.Manv2, tennv = admin.Tennv }
            });
        }

        [HttpGet]
        public async Task<IActionResult> GetAllNhanVien()
        {
            var dsNhanVien = await _context.Nhanviens
                .AsNoTracking()
                .OrderBy(nv => nv.Manv2)
                .Select(nv => new
                {
                    manv2 = nv.Manv2,
                    tennv = nv.Tennv,
                    ngaysinhhv = nv.Ngaysinhhv,
                    gioitinhhv = nv.Gioitinhhv,
                    sdtnv = nv.Sdtnv,
                    diachinv = nv.Diachinv,
                    matkhaunv = nv.Matkhaunv
                })
                .ToListAsync();

            return Ok(dsNhanVien);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetNhanVienById(string id)
        {
            var nhanVien = await _context.Nhanviens.FindAsync(id);
            if (nhanVien == null) return NotFound(new { message = "Không tìm thấy nhân viên." });
            return Ok(nhanVien);
        }

        [HttpPost]
        public async Task<IActionResult> AddNhanVien([FromBody] Nhanvien nhanVien)
        {
            if (string.IsNullOrWhiteSpace(nhanVien.Manv2))
                return BadRequest(new { message = "Mã nhân viên không được để trống." });

            if (await _context.Nhanviens.AnyAsync(nv => nv.Manv2 == nhanVien.Manv2))
                return Conflict(new { message = "Mã nhân viên này đã tồn tại." });

            _context.Nhanviens.Add(nhanVien);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNhanVienById), new { id = nhanVien.Manv2 }, new
            {
                message = "Thêm nhân viên thành công!",
                data = nhanVien
            });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNhanVien(string id, [FromBody] Nhanvien nhanVien)
        {
            if (id != nhanVien.Manv2)
                return BadRequest(new { message = "Mã nhân viên trên URL và dữ liệu không khớp." });

            var nhanVienCu = await _context.Nhanviens.FindAsync(id);
            if (nhanVienCu == null) return NotFound(new { message = "Không tìm thấy nhân viên để cập nhật." });

            nhanVienCu.Tennv = nhanVien.Tennv;
            nhanVienCu.Ngaysinhhv = nhanVien.Ngaysinhhv;
            nhanVienCu.Gioitinhhv = nhanVien.Gioitinhhv;
            nhanVienCu.Sdtnv = nhanVien.Sdtnv;
            nhanVienCu.Diachinv = nhanVien.Diachinv;
            nhanVienCu.Matkhaunv = nhanVien.Matkhaunv;

            await _context.SaveChangesAsync();
            return Ok(new { message = "Cập nhật nhân viên thành công!" });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhanVien(string id)
        {
            var nhanVien = await _context.Nhanviens.FindAsync(id);
            if (nhanVien == null) return NotFound(new { message = "Không tìm thấy nhân viên." });

            try
            {
                _context.Nhanviens.Remove(nhanVien);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Đã xóa nhân viên thành công." });
            }
            catch (DbUpdateException)
            {
                return StatusCode(409, new { message = "Không thể xóa! Nhân viên này đang có dữ liệu liên quan đến phiếu thanh toán hoặc quản lý khóa học." });
            }
        }
    }
}
