using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HocvienController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public HocvienController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // ==========================================
        // 1. API ĐĂNG NHẬP (Đã test thành công)
        // ==========================================
        public class HocvienLoginRequest
        {
            public string Username { get; set; } = null!;
            public string Password { get; set; } = null!;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] HocvienLoginRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Vui lòng nhập đầy đủ tài khoản và mật khẩu." });

            var hocvien = await _context.Hocviens
                .FirstOrDefaultAsync(h => h.Mahv == request.Username && h.Matkhauhv == request.Password);

            if (hocvien == null)
                return Unauthorized(new { message = "Tên đăng nhập hoặc mật khẩu không chính xác!" });

            return Ok(new
            {
                message = "Đăng nhập thành công!",
                user = new { mahv = hocvien.Mahv, hotenhv = hocvien.Hotenhv, malop = hocvien.Malop }
            });
        }

        // ==========================================
        // 2. LẤY DANH SÁCH TẤT CẢ HỌC VIÊN
        // ==========================================
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Hocvien>>> GetHocviens()
        {
            return await _context.Hocviens.ToListAsync();
        }

        // ==========================================
        // 3. LẤY THÔNG TIN 1 HỌC VIÊN THEO MÃ (MAHV)
        // ==========================================
        [HttpGet("{id}")]
        public async Task<ActionResult<Hocvien>> GetHocvien(string id)
        {
            var hocvien = await _context.Hocviens.FindAsync(id);

            if (hocvien == null)
            {
                return NotFound(new { message = "Không tìm thấy học viên này!" });
            }

            return Ok(hocvien);
        }

        // ==========================================
        // 4. THÊM MỚI MỘT HỌC VIÊN
        // ==========================================
        [HttpPost]
        public async Task<ActionResult<Hocvien>> PostHocvien(Hocvien hocvien)
        {
            // Kiểm tra xem mã học viên đã tồn tại chưa
            if (_context.Hocviens.Any(e => e.Mahv == hocvien.Mahv))
            {
                return Conflict(new { message = "Mã học viên này đã tồn tại trong hệ thống!" });
            }

            _context.Hocviens.Add(hocvien);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetHocvien), new { id = hocvien.Mahv }, hocvien);
        }

        // ==========================================
        // 5. CẬP NHẬT THÔNG TIN HỌC VIÊN
        // ==========================================
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHocvien(string id, Hocvien hocvien)
        {
            if (id != hocvien.Mahv)
            {
                return BadRequest(new { message = "Mã học viên trên URL và trong dữ liệu không khớp!" });
            }

            _context.Entry(hocvien).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!HocvienExists(id))
                {
                    return NotFound(new { message = "Không tìm thấy học viên để cập nhật!" });
                }
                else
                {
                    throw; // Lỗi hệ thống khác
                }
            }

            return Ok(new { message = "Cập nhật thông tin học viên thành công!" });
        }

        // ==========================================
        // 6. XÓA HỌC VIÊN
        // ==========================================
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHocvien(string id)
        {
            var hocvien = await _context.Hocviens.FindAsync(id);
            if (hocvien == null)
            {
                return NotFound(new { message = "Không tìm thấy học viên để xóa!" });
            }

            _context.Hocviens.Remove(hocvien);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Đã xóa học viên thành công!" });
        }

        private bool HocvienExists(string id)
        {
            return _context.Hocviens.Any(e => e.Mahv == id);
        }
    }
}