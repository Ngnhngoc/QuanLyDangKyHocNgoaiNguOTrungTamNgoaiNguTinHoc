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

        // Tạo 1 class nhỏ để nhận dữ liệu từ React gửi lên
        public class AdminLoginRequest
{
    public string Username { get; set; } = null!;
    public string Password { get; set; } = null!;
}

        [HttpPost("login")]
        public async Task<IActionResult> LoginAdmin([FromBody] AdminLoginRequest request)
        {
            // Kiểm tra trong bảng NHANVIEN xem có ai khớp MANV2 và MATKHAU không
            var admin = await _context.Nhanviens
                .FirstOrDefaultAsync(n => n.Manv2 == request.Username && n.Matkhaunv == request.Password);

            if (admin == null)
            {
                return Unauthorized(new { message = "Sai tài khoản hoặc mật khẩu Quản trị!" });
            }

            return Ok(new { 
                message = "Đăng nhập Admin thành công!", 
                role = "admin", 
                user = new { manv = admin.Manv2, tennv = admin.Tennv } // Chỉ trả về thông tin cần thiết
            });
        }
    }
}