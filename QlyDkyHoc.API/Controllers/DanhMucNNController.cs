using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models; // Đảm bảo gọi đúng thư mục Models của em

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DanhMucNNController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public DanhMucNNController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // GET: api/danhmucnn
        [HttpGet]
        public async Task<IActionResult> GetAllDanhMuc()
        {
            var danhMuc = await _context.Danhmucnns
                .Select(dm => new 
                {
                    maDanhMuc = dm.Madanhmuc,
                    tenDanhMuc = dm.Tendanhmuc
                }).ToListAsync();

            if (!danhMuc.Any())
            {
                return NotFound("Chưa có danh mục nào.");
            }

            return Ok(danhMuc);
        }
        // GET: api/DanhMucNN/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDanhMucNNById(string id)
        {
            // Tìm danh mục theo mã (id)
            var danhMuc = await _context.Danhmucnns.FindAsync(id);
            
            if (danhMuc == null) 
                return NotFound("Không tìm thấy danh mục ngoại ngữ.");
                
            return Ok(danhMuc);
        }



        // POST: api/danhmucnn (Thêm mới)
        [HttpPost]
        public async Task<IActionResult> AddDanhMuc([FromBody] Danhmucnn danhMuc)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);
            
            _context.Danhmucnns.Add(danhMuc);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Thêm danh mục thành công!", data = danhMuc });
        }

[HttpPut("{id}")]
public async Task<IActionResult> UpdateDanhMuc(string id, [FromBody] Danhmucnn danhMucUpdate)
{
    // 1. Tìm bản ghi gốc từ Database lên
    var danhMucGoc = await _context.Danhmucnns.FindAsync(id);
    
    if (danhMucGoc == null) return NotFound("Không tìm thấy danh mục!");

    // 2. Chỉ cập nhật Tên, tuyệt đối không đụng vào Mã (Khóa chính)
    // Ngọc lưu ý: Hãy kiểm tra kỹ chữ 'Tendanhmuc' trong file Danhmucnn.cs viết như thế nào nhé
    danhMucGoc.Tendanhmuc = danhMucUpdate.Tendanhmuc;

    try
    {
        await _context.SaveChangesAsync();
        return Ok(new { message = "Cập nhật thành công!" });
    }
    catch (Exception ex)
    {
        // Đoạn này quan trọng: Nó sẽ lôi cái lỗi "thầm kín" ở bên trong ra cho em xem
        var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
        return StatusCode(500, $"Lỗi thực sự là: {errorDetail}");
    }
}

        // DELETE: api/danhmucnn/{id} (Xóa)
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteDanhMuc(string id)
{
    // 1. Tìm ngôn ngữ cần xóa
    var danhMuc = await _context.Danhmucnns.FindAsync(id);
    if (danhMuc == null) return NotFound("Không tìm thấy danh mục.");

    try
    {
        // 2. Thử xóa
        _context.Danhmucnns.Remove(danhMuc);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa danh mục thành công!" });
    }
    catch (DbUpdateException) 
    {
        // 3. Bắt lỗi nếu dính Khóa Ngoại (đang có khóa học dùng ngôn ngữ này)
        // Trả về mã lỗi 409 (Conflict) cùng lời nhắn đàng hoàng
        return StatusCode(409, new { message = "Không thể xóa! Ngôn ngữ này đang có khóa học hoạt động." });
    }
    catch (Exception ex)
    {
        // Lỗi khác
        return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
    }
}
    }
}