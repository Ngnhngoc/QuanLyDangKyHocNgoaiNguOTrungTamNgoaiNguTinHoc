using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

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

[HttpGet]
public async Task<IActionResult> GetLichKhaiGiang()
{
    var lichHoc = await (from lop in _context.Lophocs
                         join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                         select new
                         {
                             maLop = lop.Malop,
                             tenKhoaHoc = kh.Tenkh + " (" + lop.Tenlop + ")",
                             
                             // LẤY CẢ 2 CON SỐ ĐỂ LÀM TỈ LỆ
                             daGhiDanh = lop.Siso ?? 0,
                             tongCho = lop.Soluong ?? 0,
                             
                             ngayKhaiGiang = lop.Ngaybdhoc.HasValue ? lop.Ngaybdhoc.Value.ToString("dd/MM/yyyy") : "Đang cập nhật",
                             buoiHoc = lop.Ngayhoc,
                             gioHoc = lop.Giohoc,
                             
                             // Tự động tính tình trạng dựa trên số chỗ còn lại
                             tinhTrang = (lop.Soluong - lop.Siso <= 5) ? "Gần hết chỗ" : "Đang tuyển"
                         }).ToListAsync();

    return Ok(lichHoc);
}
// 2. GET: api/LopHoc/{id} (Lấy thông tin 1 lớp học cụ thể để làm chức năng Sửa)
        [HttpGet("{id}")]
        public async Task<IActionResult> GetLopHocById(string id)
        {
            var lop = await _context.Lophocs.FindAsync(id);
            if (lop == null) return NotFound("Không tìm thấy lớp học.");
            return Ok(lop);
        }

        // 3. POST: api/LopHoc (Thêm mới 1 lớp học từ trang Admin)
        [HttpPost]
        public async Task<IActionResult> AddLopHoc([FromBody] Lophoc lop)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            // Tự động gán sĩ số ban đầu bằng 0 khi vừa mở lớp mới
            if (lop.Siso == null) lop.Siso = 0;

            try
            {
                _context.Lophocs.Add(lop);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Thêm lớp học thành công!", data = lop });
            }
            catch (Exception ex)
            {
                var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
                return StatusCode(500, $"Lỗi SQL: {errorDetail}");
            }
        }

        // 4. PUT: api/LopHoc/{id} (Sửa thông tin lớp học, vd: dời ngày khai giảng, tăng số lượng)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLopHoc(string id, [FromBody] Lophoc lop)
        {
            if (id != lop.Malop) return BadRequest("Mã lớp học không khớp.");

            _context.Entry(lop).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
                return Ok(new { message = "Cập nhật lớp học thành công!" });
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Lophocs.Any(e => e.Malop == id))
                    return NotFound("Không tìm thấy lớp học để sửa.");
                else throw;
            }
        }

        // 5. DELETE: api/LopHoc/{id} (Hủy lớp học)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLopHoc(string id)
        {
            var lop = await _context.Lophocs.FindAsync(id);
            if (lop == null) return NotFound("Không tìm thấy lớp học.");

            _context.Lophocs.Remove(lop);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Đã hủy lớp học thành công." });
        }
    }
}