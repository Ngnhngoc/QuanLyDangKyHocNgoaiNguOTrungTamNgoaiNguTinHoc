using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;
using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DangKyController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public DangKyController(QlyDkyHocContext context)
        {
            _context = context;
        }

        [HttpGet("ChoDuyet")]
        public async Task<IActionResult> GetDanhSachChoDuyet()
        {
            var dsChoDuyet = await (from dk in _context.Dangkies
                                    join hv in _context.Hocviens on dk.Mahv equals hv.Mahv
                                    join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                    where dk.TrangThai == 0 || dk.TrangThai == null
                                    orderby dk.Ngaydangky descending
                                    select new
                                    {
                                        maHv = hv.Mahv,
                                        tenHv = hv.Hotenhv,
                                        sdt = hv.Dienthoaihv,
                                        email = hv.Emailhv,
                                        maLop = lop.Malop,
                                        tenLop = lop.Tenlop,
                                        ngayDangKy = dk.Ngaydangky.HasValue
                                            ? dk.Ngaydangky.Value.ToString("dd/MM/yyyy HH:mm")
                                            : "Vua xong"
                                    }).ToListAsync();

            return Ok(dsChoDuyet);
        }

        [HttpPut("Duyet/{maHv}/{maLop}")]
        public async Task<IActionResult> DuyetHocVien(string maHv, string maLop)
        {
            var dangKy = await _context.Dangkies.FirstOrDefaultAsync(dk => dk.Mahv == maHv && dk.Malop == maLop);
            if (dangKy == null) return NotFound(new { message = "Khong tim thay phieu dang ky." });

            var lop = await _context.Lophocs.FindAsync(maLop);
            if (lop == null) return NotFound(new { message = "Khong tim thay lop hoc." });

            if (dangKy.TrangThai == 1)
            {
                return Ok(new { message = "Hoc vien da duoc duyet truoc do." });
            }

            var siSo = lop.Siso ?? 0;
            var sucChua = lop.Soluong ?? 0;
            if (sucChua > 0 && siSo >= sucChua)
            {
                return BadRequest(new { message = "Lop hoc nay da du so luong toi da." });
            }

            dangKy.TrangThai = 1;
            lop.Siso = siSo + 1;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Da duyet ghi danh thanh cong." });
        }

        [HttpDelete("TuChoi/{maHv}/{maLop}")]
        public async Task<IActionResult> TuChoiHocVien(string maHv, string maLop)
        {
            var dangKy = await _context.Dangkies.FirstOrDefaultAsync(dk => dk.Mahv == maHv && dk.Malop == maLop);
            if (dangKy == null) return NotFound(new { message = "Khong tim thay phieu dang ky." });

            _context.Dangkies.Remove(dangKy);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Da tu choi va huy phieu dang ky." });
        }

        [HttpPost]
        public async Task<IActionResult> DangKyLop([FromBody] GhiDanhDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Mahv) || string.IsNullOrWhiteSpace(dto.Malop))
                return BadRequest(new { message = "Ma hoc vien va ma lop la bat buoc." });

            var hocVien = await _context.Hocviens.FindAsync(dto.Mahv);
            if (hocVien == null) return NotFound(new { message = "Khong tim thay hoc vien." });

            var lop = await _context.Lophocs.FindAsync(dto.Malop);
            if (lop == null) return NotFound(new { message = "Khong tim thay lop hoc." });

            var daDangKy = await _context.Dangkies.AnyAsync(x => x.Mahv == dto.Mahv && x.Malop == dto.Malop);
            if (daDangKy) return Conflict(new { message = "Hoc vien da dang ky lop nay." });

            var dangKy = new Dangky
            {
                Mahv = dto.Mahv,
                Malop = dto.Malop,
                Ngaydangky = DateTime.Now,
                TrangThai = 0
            };

            _context.Dangkies.Add(dangKy);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Ghi danh thanh cong. Vui long cho trung tam duyet." });
        }

        [HttpGet("LichHocCuaToi/{mahv}")]
        public async Task<IActionResult> GetLichHocCuaToi(string mahv)
        {
            var lichHoc = await (from dk in _context.Dangkies
                                 join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                 join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                 where dk.Mahv == mahv && dk.TrangThai == 1
                                 orderby lop.Ngaybdhoc
                                 select new
                                 {
                                     maLop = lop.Malop,
                                     tenLop = lop.Tenlop,
                                     maKhoaHoc = kh.Makh,
                                     tenKhoaHoc = kh.Tenkh,
                                     ngayKhaiGiang = lop.Ngaybdhoc.HasValue ? lop.Ngaybdhoc.Value.ToString("dd/MM/yyyy") : "Dang cap nhat",
                                     buoiHoc = lop.Ngayhoc ?? "Chua xep",
                                     gioHoc = lop.Giohoc ?? "Chua xep",
                                     phongHoc = "Tang 2 - Co so 1",
                                     trangThai = "Da duyet"
                                 }).ToListAsync();

            return Ok(lichHoc);
        }

        [HttpGet("HocPhiCuaToi/{mahv}")]
        public async Task<IActionResult> GetHocPhiCuaToi(string mahv)
        {
            var hocPhiList = await (from dk in _context.Dangkies
                                    join hv in _context.Hocviens on dk.Mahv equals hv.Mahv
                                    join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                    join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                    let thanhToan = _context.Phieuthanhtoans
                                        .Where(pt => pt.Mahv == dk.Mahv && pt.Malop == dk.Malop)
                                        .OrderByDescending(pt => pt.Ngaythanhtoan2)
                                        .FirstOrDefault()
                                    where dk.Mahv == mahv
                                    orderby dk.Ngaydangky descending
                                    select new
                                    {
                                        maHocVien = hv.Mahv,
                                        tenHocVien = hv.Hotenhv,
                                        maLop = lop.Malop,
                                        tenLop = lop.Tenlop,
                                        maKhoaHoc = kh.Makh,
                                        tenKhoaHoc = kh.Tenkh,
                                        ngayDangKy = dk.Ngaydangky,
                                        hocPhi = kh.Hocphi ?? 0,
                                        trangThaiDangKy = dk.TrangThai == 1 ? "Đã duyệt" : dk.TrangThai == 2 ? "Đã hủy" : "Chờ duyệt",
                                        maPhieu = thanhToan != null ? thanhToan.Maphieu : null,
                                        trangThaiPhieu = thanhToan != null ? thanhToan.Trangthai : null,
                                        daThanhToan = thanhToan != null && thanhToan.Trangthai == "DA_THANH_TOAN",
                                        trangThaiThanhToan =
                                            thanhToan == null ? "Chưa có phiếu" :
                                            thanhToan.Trangthai == "DA_THANH_TOAN" ? "Đã thanh toán" :
                                            thanhToan.Trangthai == "CHO_XAC_NHAN" ? "Chờ xác nhận" :
                                            thanhToan.Trangthai == "HUY" ? "Hủy phiếu" :
                                            "Chưa thanh toán",
                                        trangThai = thanhToan != null && thanhToan.Trangthai == "DA_THANH_TOAN" ? 1 : 0,
                                        ngayThanhToan = thanhToan != null ? thanhToan.Ngaythanhtoan : null,
                                        hinhThucThanhToan = thanhToan != null ? thanhToan.Hinhthuctt : null
                                    }).ToListAsync();

            return Ok(hocPhiList);
        }

        public class GhiDanhDto
        {
            [JsonPropertyName("mahv")]
            public string Mahv { get; set; } = string.Empty;

            [JsonPropertyName("malop")]
            public string Malop { get; set; } = string.Empty;
        }
    }
}
