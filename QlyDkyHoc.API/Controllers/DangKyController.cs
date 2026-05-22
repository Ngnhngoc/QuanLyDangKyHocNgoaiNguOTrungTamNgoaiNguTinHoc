using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DangkyController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public DangkyController(QlyDkyHocContext context)
        {
            _context = context;
        }

        public class GhiDanhRequest
        {
            public string Mahv { get; set; } = null!;
            public string Malop { get; set; } = null!;
        }

        [HttpPost("GhiDanh")]
        public async Task<IActionResult> GhiDanh([FromBody] GhiDanhRequest request)
        {
            // 1. Kiểm tra xem học viên này đã đăng ký lớp này chưa
            var daDangKy = await _context.Dangkies
                .AnyAsync(d => d.Mahv == request.Mahv && d.Malop == request.Malop);

            if (daDangKy)
            {
                return BadRequest(new { message = "Bạn đã đăng ký lớp học này rồi!" });
            }

            // 2. Tạo phiếu đăng ký mới với trạng thái mặc định là 0 (Chờ đóng phí)
            var dangKyMoi = new Dangky
            {
                Mahv = request.Mahv,
                Malop = request.Malop,
                Ngaydangky = DateTime.Now, // Lấy giờ hiện tại
                TrangThai = 0 
            };

            _context.Dangkies.Add(dangKyMoi);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ghi danh thành công! Vui lòng thanh toán học phí." });
        }
    }
}