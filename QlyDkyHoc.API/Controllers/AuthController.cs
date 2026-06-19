using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public AuthController(QlyDkyHocContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.MaSo) || string.IsNullOrWhiteSpace(request.MatKhau))
                {
                    return BadRequest(new { message = "Vui lòng nhập đầy đủ tài khoản và mật khẩu." });
                }

                var maSo = request.MaSo.Trim().ToUpper();
                var matKhau = request.MatKhau.Trim();

                // 1. Kiểm tra Giảng viên
                var gv = await _context.Giangviens
                    .AsNoTracking()
                    .FirstOrDefaultAsync(g =>
                        g.Magv != null &&
                        g.Magv.Trim().ToUpper() == maSo
                    );

                if (gv != null && (gv.Matkhaunv ?? "").Trim() == matKhau)
                {
                    return Ok(new
                    {
                        message = "Đăng nhập giảng viên thành công!",
                        role = "giangvien",
                        token = "fake-token-giangvien",
                        user = new
                        {
                            maSo = gv.Magv,
                            magv = gv.Magv,
                            hoTen = gv.Tennv,
                            tennv = gv.Tennv,
                            chuyenmon = gv.Chuyenmon,
                            emailnv = gv.Emailnv,
                            sdtnv = gv.Sdtnv,
                            vaiTro = "giangvien"
                        }
                    });
                }

                // 2. Kiểm tra Nhân viên / Admin
                var nv = await _context.Nhanviens
                    .AsNoTracking()
                    .FirstOrDefaultAsync(n =>
                        n.Manv2 != null &&
                        n.Manv2.Trim().ToUpper() == maSo
                    );

                if (nv != null && (nv.Matkhaunv ?? "").Trim() == matKhau)
                {
                    // admin và NV001 là quản trị hệ thống
                    // các nhân viên còn lại, ví dụ NV002, là nhân viên/kế toán
                    var roleNv = maSo == "ADMIN" || maSo == "NV001"
                        ? "admin"
                        : "nhanvien";

                    return Ok(new
                    {
                        message = roleNv == "admin"
                            ? "Đăng nhập quản trị thành công!"
                            : "Đăng nhập nhân viên thành công!",
                        role = roleNv,
                        token = "fake-token-" + roleNv,
                        user = new
                        {
                            maSo = nv.Manv2,
                            manv = nv.Manv2,
                            manv2 = nv.Manv2,
                            hoTen = nv.Tennv,
                            tennv = nv.Tennv,
                            vaiTro = roleNv
                        }
                    });
                }

                // 3. Kiểm tra Học viên
                var hv = await _context.Hocviens
                    .AsNoTracking()
                    .FirstOrDefaultAsync(h =>
                        h.Mahv != null &&
                        h.Mahv.Trim().ToUpper() == maSo
                    );

                if (hv != null && (hv.Matkhauhv ?? "").Trim() == matKhau)
                {
                    return Ok(new
                    {
                        message = "Đăng nhập học viên thành công!",
                        role = "hocvien",
                        token = "fake-token-hocvien",
                        user = new
                        {
                            maSo = hv.Mahv,
                            mahv = hv.Mahv,
                            hoTen = hv.Hotenhv,
                            hotenhv = hv.Hotenhv,
                            tenhv = hv.Hotenhv,
                            malop = hv.Malop,
                            vaiTro = "hocvien"
                        }
                    });
                }

                return Unauthorized(new { message = "Mã số hoặc mật khẩu không chính xác!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi xử lý đăng nhập ở backend.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("doi-mat-khau")]
        public async Task<IActionResult> DoiMatKhau([FromBody] DoiMatKhauRequest request)
        {
            try
            {
                if (request == null ||
                    string.IsNullOrWhiteSpace(request.MaSo) ||
                    string.IsNullOrWhiteSpace(request.MatKhauCu) ||
                    string.IsNullOrWhiteSpace(request.MatKhauMoi))
                {
                    return BadRequest(new { message = "Vui lòng nhập đầy đủ tài khoản, mật khẩu cũ và mật khẩu mới." });
                }

                if (request.MatKhauMoi.Trim().Length < 6)
                {
                    return BadRequest(new { message = "Mật khẩu mới phải có ít nhất 6 ký tự." });
                }

                if (!string.IsNullOrWhiteSpace(request.XacNhanMatKhau) &&
                    request.MatKhauMoi.Trim() != request.XacNhanMatKhau.Trim())
                {
                    return BadRequest(new { message = "Xác nhận mật khẩu mới không khớp." });
                }

                var maSo = request.MaSo.Trim().ToUpper();
                var matKhauCu = request.MatKhauCu.Trim();
                var matKhauMoi = request.MatKhauMoi.Trim();

                var gv = await _context.Giangviens
                    .FirstOrDefaultAsync(g => g.Magv != null && g.Magv.Trim().ToUpper() == maSo);

                if (gv != null)
                {
                    if ((gv.Matkhaunv ?? "").Trim() != matKhauCu)
                    {
                        return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
                    }

                    gv.Matkhaunv = matKhauMoi;
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Đổi mật khẩu giảng viên thành công." });
                }

                var nv = await _context.Nhanviens
                    .FirstOrDefaultAsync(n => n.Manv2 != null && n.Manv2.Trim().ToUpper() == maSo);

                if (nv != null)
                {
                    if ((nv.Matkhaunv ?? "").Trim() != matKhauCu)
                    {
                        return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
                    }

                    nv.Matkhaunv = matKhauMoi;
                    await _context.SaveChangesAsync();

                    var laAdmin = maSo == "ADMIN" || maSo == "NV001";
                    return Ok(new
                    {
                        message = laAdmin
                            ? "Đổi mật khẩu admin thành công."
                            : "Đổi mật khẩu nhân viên thành công."
                    });
                }

                var hv = await _context.Hocviens
                    .FirstOrDefaultAsync(h => h.Mahv != null && h.Mahv.Trim().ToUpper() == maSo);

                if (hv != null)
                {
                    if ((hv.Matkhauhv ?? "").Trim() != matKhauCu)
                    {
                        return BadRequest(new { message = "Mật khẩu cũ không chính xác." });
                    }

                    hv.Matkhauhv = matKhauMoi;
                    await _context.SaveChangesAsync();
                    return Ok(new { message = "Đổi mật khẩu học viên thành công." });
                }

                return NotFound(new { message = "Không tìm thấy tài khoản cần đổi mật khẩu." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    message = "Lỗi xử lý đổi mật khẩu ở backend.",
                    error = ex.Message,
                    innerError = ex.InnerException?.Message
                });
            }
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] Hocvien request)
        {
            var isExist = _context.Hocviens.Any(h => h.Mahv == request.Mahv);

            if (isExist)
            {
                return BadRequest(new { message = "Mã số này đã được đăng ký!" });
            }

            try
            {
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

    public class DoiMatKhauRequest
    {
        public string MaSo { get; set; } = string.Empty;
        public string MatKhauCu { get; set; } = string.Empty;
        public string MatKhauMoi { get; set; } = string.Empty;
        public string? XacNhanMatKhau { get; set; }
    }

    public class LoginRequest
    {
        public string MaSo { get; set; } = string.Empty;
        public string MatKhau { get; set; } = string.Empty;
    }
}