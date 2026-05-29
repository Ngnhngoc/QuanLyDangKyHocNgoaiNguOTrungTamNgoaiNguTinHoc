using Microsoft.AspNetCore.Mvc;
using QlyDkyHoc.API.Models; // Đảm bảo namespace này khớp với các file trong thư mục Models của em
using System.Linq;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Sửa lại đúng tên QlyDkyHocContext mà hệ thống đã sinh ra
        private readonly QlyDkyHocContext _context;

        public AuthController(QlyDkyHocContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // 1. Kiểm tra Nhân viên (MANV2)
            var nv = _context.Nhanviens.FirstOrDefault(n => n.Manv2 == request.MaSo && n.Matkhaunv == request.MatKhau);
            if (nv != null) 
            {
                return Ok(new { maSo = nv.Manv2, hoTen = nv.Tennv, vaiTro = "Admin", token = "fake-token-admin" });
            }

            // 2. Kiểm tra Giảng viên (MAGV)
            var gv = _context.Giangviens.FirstOrDefault(g => g.Magv == request.MaSo && g.Matkhaunv == request.MatKhau);
            if (gv != null) 
            {
                return Ok(new { maSo = gv.Magv, hoTen = gv.Tennv, vaiTro = "GiangVien", token = "fake-token-gv" });
            }

            // 3. Kiểm tra Học viên (MAHV)
            var hv = _context.Hocviens.FirstOrDefault(h => h.Mahv == request.MaSo && h.Matkhauhv == request.MatKhau);
            if (hv != null) 
            {
                return Ok(new { maSo = hv.Mahv, hoTen = hv.Hotenhv, vaiTro = "HocVien", token = "fake-token-hv" });
            }

            return Unauthorized(new { message = "Mã số hoặc mật khẩu không chính xác!" });
        }
        [HttpPost("register")]
public IActionResult Register([FromBody] Hocvien request)
{
    // 1. Kiểm tra mã học viên đã tồn tại chưa
    var isExist = _context.Hocviens.Any(h => h.Mahv == request.Mahv);
    if (isExist) return BadRequest(new { message = "Mã số này đã được đăng ký!" });

    try
    {
        // 2. Lưu vào bảng HOCVIEN
        _context.Hocviens.Add(request);
        _context.SaveChanges();
        return Ok(new { message = "Thành công" });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = "Lỗi: " + ex.Message });
    }
}
    }
}