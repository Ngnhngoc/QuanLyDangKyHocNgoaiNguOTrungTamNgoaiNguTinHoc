using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models; 

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoaHocController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public KhoaHocController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // GET: api/khoahoc
        [HttpGet]
        public async Task<IActionResult> GetAllKhoaHoc()
        {
            var danhSachKhoaHoc = await (from kh in _context.Khoahocs
                                         join dm in _context.Danhmucnns on kh.Madanhmuc equals dm.Madanhmuc
                                         select new
                                         {
                                             maKH = kh.Makh,
                                             tenKH = kh.Tenkh,
                                             maDanhMuc = kh.Madanhmuc,
                                             danhMuc = dm.Tendanhmuc, // Lấy tên ngôn ngữ thay vì mã
                                             // Xử lý định dạng ngày tháng để React dễ đọc
                                             ngayBD = kh.Ngaybdau.HasValue ? kh.Ngaybdau.Value.ToString("yyyy-MM-dd") : null,
                                             // 2. THÊM DÒNG NÀY ĐỂ GỬI NGÀY KẾT THÚC SANG REACT (Em bị thiếu dòng này nè!)
                                             ngayKT = kh.Ngaykthuc.HasValue ? kh.Ngaykthuc.Value.ToString("yyyy-MM-dd") : null,
                                             hocPhi = kh.Hocphi,
                                             moTa = kh.Mota
                                         }).ToListAsync();
                                         

            if (!danhSachKhoaHoc.Any())
            {
                return NotFound("Chưa có khóa học nào.");
            }

            return Ok(danhSachKhoaHoc);
        }
        // GET: api/KhoaHoc/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetKhoaHocById(string id)
        {
            // Tìm khóa học theo mã (id)
            var khoaHoc = await _context.Khoahocs.FindAsync(id);
            
            if (khoaHoc == null) 
                return NotFound("Không tìm thấy khóa học.");
                
            return Ok(khoaHoc);
        }
        // POST: api/khoahoc (Thêm mới)
        [HttpPost]
public async Task<IActionResult> AddKhoaHoc([FromBody] Khoahoc khoaHoc)
{
    if (!ModelState.IsValid) return BadRequest(ModelState);

    try
    {
        _context.Khoahocs.Add(khoaHoc);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Thêm khóa học thành công!", data = khoaHoc });
    }
    catch (Exception ex)
    {
        // Lôi cái lỗi thầm kín của SQL ra ánh sáng
        var errorDetail = ex.InnerException != null ? ex.InnerException.Message : ex.Message;
        return StatusCode(500, $"Lỗi thực sự là: {errorDetail}");
    }
}

        // PUT: api/khoahoc/{id} (Cập nhật)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKhoaHoc(string id, [FromBody] Khoahoc khoaHoc)
        {
            if (id != khoaHoc.Makh) return BadRequest("Mã khóa học không khớp!");

            _context.Entry(khoaHoc).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.Khoahocs.Any(e => e.Makh == id))
                    return NotFound("Không tìm thấy khóa học để sửa.");
                else throw;
            }

            return Ok(new { message = "Cập nhật khóa học thành công!" });
        }

        // DELETE: api/khoahoc/{id} (Xóa)
[HttpDelete("{id}")]
public async Task<IActionResult> DeleteKhoaHoc(string id)
{
    var khoaHoc = await _context.Khoahocs.FindAsync(id);
    if (khoaHoc == null) return NotFound(new { message = "Không tìm thấy khóa học." });

    try
    {
        _context.Khoahocs.Remove(khoaHoc);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Xóa khóa học thành công!" });
    }
    catch (DbUpdateException)
    {
        // SQL Server giương cờ báo lỗi Khóa Ngoại (đang có lớp học dính tới khóa này)
        return StatusCode(409, new { message = "Không thể xóa! Khóa học này đang có Lớp học hoạt động." });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { message = $"Lỗi hệ thống: {ex.Message}" });
    }
}
    }
}