using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

namespace QlyDkyHoc.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PhieuThanhToanController : ControllerBase
    {
        private readonly QlyDkyHocContext _context;

        public PhieuThanhToanController(QlyDkyHocContext context)
        {
            _context = context;
        }

        // GET: api/PhieuThanhToan
        [HttpGet]
        public async Task<ActionResult<IEnumerable<object>>> GetAll()
        {
            var danhSach = await _context.Phieuthanhtoans
                .OrderByDescending(p => p.Ngaythanhtoan2)
                .Select(p => new
                {
                    maPhieu = p.Maphieu,

                    maHocVien = p.Mahv,
                    tenHocVien = _context.Hocviens
                        .Where(hv => hv.Mahv == p.Mahv)
                        .Select(hv => hv.Hotenhv)
                        .FirstOrDefault(),

                    sdt = _context.Hocviens
                        .Where(hv => hv.Mahv == p.Mahv)
                        .Select(hv => hv.Dienthoaihv)
                        .FirstOrDefault(),

                    email = _context.Hocviens
                        .Where(hv => hv.Mahv == p.Mahv)
                        .Select(hv => hv.Emailhv)
                        .FirstOrDefault(),

                    maNhanVien = p.Manv2,
                    tenNhanVien = _context.Nhanviens
                        .Where(nv => nv.Manv2 == p.Manv2)
                        .Select(nv => nv.Tennv)
                        .FirstOrDefault(),

                    maLop = p.Malop,

                    tenLop = _context.Lophocs
                        .Where(l => l.Malop == p.Malop)
                        .Select(l => l.Tenlop)
                        .FirstOrDefault(),

                    maKhoaHoc = _context.Lophocs
                        .Where(l => l.Malop == p.Malop)
                        .Select(l => l.Makh)
                        .FirstOrDefault(),

                    tenKhoaHoc = (
                        from lop in _context.Lophocs
                        join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                        where lop.Malop == p.Malop
                        select kh.Tenkh
                    ).FirstOrDefault(),

                    hocPhi = (
                        from lop in _context.Lophocs
                        join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                        where lop.Malop == p.Malop
                        select kh.Hocphi ?? 0
                    ).FirstOrDefault(),

                    ngayThanhToan = p.Ngaythanhtoan,
                    ngayCapNhat = p.Ngaythanhtoan2,
                    hinhThucThanhToan = p.Hinhthuctt,

                    trangThaiPhieu = p.Trangthai ?? "CHUA_THANH_TOAN",

                    daThanhToan = p.Trangthai == "DA_THANH_TOAN",

                    trangThaiThanhToan =
                        p.Trangthai == "DA_THANH_TOAN" ? "Đã thanh toán" :
                        p.Trangthai == "CHO_XAC_NHAN" ? "Chờ xác nhận" :
                        p.Trangthai == "HUY" ? "Hủy phiếu" :
                        "Chưa thanh toán",

                    trangThaiDangKy = _context.Dangkies
                        .Where(dk => dk.Mahv == p.Mahv && dk.Malop == p.Malop)
                        .Select(dk =>
                            dk.TrangThai == 1 ? "Đã duyệt" :
                            dk.TrangThai == 2 ? "Đã hủy" :
                            "Chờ duyệt"
                        )
                        .FirstOrDefault(),

                    ngayDangKy = _context.Dangkies
                        .Where(dk => dk.Mahv == p.Mahv && dk.Malop == p.Malop)
                        .Select(dk => dk.Ngaydangky)
                        .FirstOrDefault()
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        // GET: api/PhieuThanhToan/{maPhieu}
        [HttpGet("{maPhieu}")]
        public async Task<ActionResult<object>> GetById(string maPhieu)
        {
            var phieu = await _context.Phieuthanhtoans
                .Where(p => p.Maphieu == maPhieu)
                .Select(p => new
                {
                    maPhieu = p.Maphieu,
                    maHocVien = p.Mahv,
                    maNhanVien = p.Manv2,
                    maLop = p.Malop,
                    ngayThanhToan = p.Ngaythanhtoan,
                    ngayCapNhat = p.Ngaythanhtoan2,
                    hinhThucThanhToan = p.Hinhthuctt,
                    trangThaiPhieu = p.Trangthai ?? "CHUA_THANH_TOAN"
                })
                .FirstOrDefaultAsync();

            if (phieu == null)
            {
                return NotFound(new { message = "Không tìm thấy phiếu thanh toán." });
            }

            return Ok(phieu);
        }

        // GET: api/PhieuThanhToan/TheoHocVien/HV001
        [HttpGet("TheoHocVien/{maHocVien}")]
        public async Task<ActionResult<IEnumerable<object>>> GetTheoHocVien(string maHocVien)
        {
            var danhSach = await _context.Phieuthanhtoans
                .Where(p => p.Mahv == maHocVien)
                .OrderByDescending(p => p.Ngaythanhtoan2)
                .Select(p => new
                {
                    maPhieu = p.Maphieu,
                    maHocVien = p.Mahv,
                    maLop = p.Malop,

                    tenLop = _context.Lophocs
                        .Where(l => l.Malop == p.Malop)
                        .Select(l => l.Tenlop)
                        .FirstOrDefault(),

                    tenKhoaHoc = (
                        from lop in _context.Lophocs
                        join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                        where lop.Malop == p.Malop
                        select kh.Tenkh
                    ).FirstOrDefault(),

                    hocPhi = (
                        from lop in _context.Lophocs
                        join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                        where lop.Malop == p.Malop
                        select kh.Hocphi ?? 0
                    ).FirstOrDefault(),

                    ngayThanhToan = p.Ngaythanhtoan,
                    hinhThucThanhToan = p.Hinhthuctt,
                    trangThaiPhieu = p.Trangthai ?? "CHUA_THANH_TOAN",
                    daThanhToan = p.Trangthai == "DA_THANH_TOAN"
                })
                .ToListAsync();

            return Ok(danhSach);
        }

        // POST: api/PhieuThanhToan
        // CRUD tạo phiếu thủ công
        [HttpPost]
        public async Task<ActionResult<object>> Create([FromBody] PhieuThanhToanDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            if (string.IsNullOrWhiteSpace(dto.Mahv) || string.IsNullOrWhiteSpace(dto.Manv2))
            {
                return BadRequest(new { message = "Thiếu mã học viên hoặc mã nhân viên." });
            }

            var hocVien = await _context.Hocviens.FindAsync(dto.Mahv);
            if (hocVien == null)
            {
                return NotFound(new { message = "Không tìm thấy học viên." });
            }

            var nhanVien = await _context.Nhanviens.FindAsync(dto.Manv2);
            if (nhanVien == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên." });
            }

            if (!string.IsNullOrWhiteSpace(dto.Malop))
            {
                var lop = await _context.Lophocs.FindAsync(dto.Malop);
                if (lop == null)
                {
                    return NotFound(new { message = "Không tìm thấy lớp học." });
                }

                var daCoPhieu = await _context.Phieuthanhtoans
                    .AnyAsync(p => p.Mahv == dto.Mahv && p.Malop == dto.Malop);

                if (daCoPhieu)
                {
                    return Conflict(new { message = "Học viên đã có phiếu thanh toán cho lớp này." });
                }
            }

            var trangThai = string.IsNullOrWhiteSpace(dto.Trangthai)
                ? "CHUA_THANH_TOAN"
                : dto.Trangthai.Trim().ToUpper();

            var phieu = new Phieuthanhtoan
            {
                Maphieu = await GenerateMaPhieuAsync(),
                Mahv = dto.Mahv.Trim(),
                Manv2 = dto.Manv2.Trim(),
                Malop = string.IsNullOrWhiteSpace(dto.Malop) ? null : dto.Malop.Trim(),
                Ngaythanhtoan = trangThai == "DA_THANH_TOAN" ? DateTime.Now : null,
                Ngaythanhtoan2 = DateTime.Now,
                Hinhthuctt = string.IsNullOrWhiteSpace(dto.Hinhthuctt) ? "Chuyen khoan" : dto.Hinhthuctt.Trim(),
                Trangthai = trangThai
            };

            _context.Phieuthanhtoans.Add(phieu);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Tạo phiếu thanh toán thành công.",
                maPhieu = phieu.Maphieu,
                data = phieu
            });
        }

        // POST: api/PhieuThanhToan/TaoSauKhiDuyet
        // API này chỉ gọi sau khi admin/nhân viên duyệt ghi danh
        [HttpPost("TaoSauKhiDuyet")]
        public async Task<ActionResult<object>> TaoSauKhiDuyet([FromBody] TaoPhieuSauKhiDuyetDTO dto)
        {
            if (dto == null ||
                string.IsNullOrWhiteSpace(dto.Mahv) ||
                string.IsNullOrWhiteSpace(dto.Malop))
            {
                return BadRequest(new { message = "Thiếu mã học viên hoặc mã lớp." });
            }

            var dangKy = await _context.Dangkies
                .FirstOrDefaultAsync(dk => dk.Mahv == dto.Mahv && dk.Malop == dto.Malop);

            if (dangKy == null)
            {
                return NotFound(new { message = "Không tìm thấy đăng ký học." });
            }

            if (dangKy.TrangThai != 1)
            {
                return BadRequest(new { message = "Chỉ tạo phiếu thanh toán sau khi đăng ký đã được duyệt." });
            }

            var daCoPhieu = await _context.Phieuthanhtoans
                .FirstOrDefaultAsync(p => p.Mahv == dto.Mahv && p.Malop == dto.Malop);

            if (daCoPhieu != null)
            {
                return Ok(new
                {
                    message = "Phiếu thanh toán đã tồn tại.",
                    maPhieu = daCoPhieu.Maphieu,
                    data = daCoPhieu
                });
            }

            var manv2 = dto.Manv2;

            if (string.IsNullOrWhiteSpace(manv2))
            {
                manv2 = await _context.Nhanviens
                    .OrderBy(nv => nv.Manv2)
                    .Select(nv => nv.Manv2)
                    .FirstOrDefaultAsync();
            }

            if (string.IsNullOrWhiteSpace(manv2))
            {
                return BadRequest(new { message = "Không tìm thấy nhân viên để lập phiếu." });
            }

            var phieu = new Phieuthanhtoan
            {
                Maphieu = await GenerateMaPhieuAsync(),
                Mahv = dto.Mahv.Trim(),
                Malop = dto.Malop.Trim(),
                Manv2 = manv2.Trim(),
                Ngaythanhtoan = null,
                Ngaythanhtoan2 = DateTime.Now,
                Hinhthuctt = "Chuyen khoan",
                Trangthai = "CHUA_THANH_TOAN"
            };

            _context.Phieuthanhtoans.Add(phieu);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Đã tạo phiếu thanh toán sau khi duyệt ghi danh.",
                maPhieu = phieu.Maphieu,
                data = phieu
            });
        }

        // PUT: api/PhieuThanhToan/{maPhieu}
        // CRUD sửa phiếu
        [HttpPut("{maPhieu}")]
        public async Task<IActionResult> Update(string maPhieu, [FromBody] PhieuThanhToanDTO dto)
        {
            var phieu = await _context.Phieuthanhtoans.FindAsync(maPhieu);

            if (phieu == null)
            {
                return NotFound(new { message = "Không tìm thấy phiếu thanh toán." });
            }

            if (!string.IsNullOrWhiteSpace(dto.Mahv))
            {
                var hocVien = await _context.Hocviens.FindAsync(dto.Mahv);

                if (hocVien == null)
                {
                    return NotFound(new { message = "Không tìm thấy học viên." });
                }

                phieu.Mahv = dto.Mahv.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Manv2))
            {
                var nhanVien = await _context.Nhanviens.FindAsync(dto.Manv2);

                if (nhanVien == null)
                {
                    return NotFound(new { message = "Không tìm thấy nhân viên." });
                }

                phieu.Manv2 = dto.Manv2.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Malop))
            {
                var lop = await _context.Lophocs.FindAsync(dto.Malop);

                if (lop == null)
                {
                    return NotFound(new { message = "Không tìm thấy lớp học." });
                }

                phieu.Malop = dto.Malop.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Hinhthuctt))
            {
                phieu.Hinhthuctt = dto.Hinhthuctt.Trim();
            }

            if (!string.IsNullOrWhiteSpace(dto.Trangthai))
            {
                var trangThai = dto.Trangthai.Trim().ToUpper();

                if (!TrangThaiHopLe(trangThai))
                {
                    return BadRequest(new { message = "Trạng thái phiếu không hợp lệ." });
                }

                phieu.Trangthai = trangThai;

                if (trangThai == "DA_THANH_TOAN")
                {
                    phieu.Ngaythanhtoan = DateTime.Now;
                }
            }

            phieu.Ngaythanhtoan2 = DateTime.Now;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật phiếu thanh toán thành công.",
                maPhieu = phieu.Maphieu
            });
        }

        // DELETE: api/PhieuThanhToan/{maPhieu}
        [HttpDelete("{maPhieu}")]
        public async Task<IActionResult> Delete(string maPhieu)
        {
            var phieu = await _context.Phieuthanhtoans.FindAsync(maPhieu);

            if (phieu == null)
            {
                return NotFound(new { message = "Không tìm thấy phiếu thanh toán." });
            }

            _context.Phieuthanhtoans.Remove(phieu);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Xóa phiếu thanh toán thành công." });
        }

        // PUT: api/PhieuThanhToan/DoiTrangThai
        [HttpPut("DoiTrangThai")]
        public async Task<IActionResult> DoiTrangThai([FromBody] DoiTrangThaiPhieuDTO dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dữ liệu không hợp lệ." });
            }

            if (string.IsNullOrWhiteSpace(dto.Mahv) ||
                string.IsNullOrWhiteSpace(dto.Malop) ||
                string.IsNullOrWhiteSpace(dto.Manv2) ||
                string.IsNullOrWhiteSpace(dto.TrangThai))
            {
                return BadRequest(new { message = "Thiếu thông tin học viên, lớp, nhân viên hoặc trạng thái." });
            }

            var trangThai = dto.TrangThai.Trim().ToUpper();

            if (!TrangThaiHopLe(trangThai))
            {
                return BadRequest(new { message = "Trạng thái phiếu không hợp lệ." });
            }

            var dangKy = await _context.Dangkies
                .FirstOrDefaultAsync(dk => dk.Mahv == dto.Mahv && dk.Malop == dto.Malop);

            if (dangKy == null)
            {
                return BadRequest(new { message = "Học viên chưa đăng ký lớp này." });
            }

            if (dangKy.TrangThai != 1)
            {
                return BadRequest(new { message = "Chỉ được cập nhật thanh toán khi đăng ký đã được duyệt." });
            }

            var nhanVien = await _context.Nhanviens.FindAsync(dto.Manv2);

            if (nhanVien == null)
            {
                return NotFound(new { message = "Không tìm thấy nhân viên." });
            }

            var phieu = await _context.Phieuthanhtoans
                .FirstOrDefaultAsync(p => p.Mahv == dto.Mahv && p.Malop == dto.Malop);

            if (phieu == null)
            {
                return BadRequest(new { message = "Chưa có phiếu thanh toán. Vui lòng duyệt ghi danh trước để tạo phiếu." });
            }

            phieu.Manv2 = dto.Manv2.Trim();
            phieu.Trangthai = trangThai;
            phieu.Ngaythanhtoan2 = DateTime.Now;

            if (trangThai == "DA_THANH_TOAN")
            {
                phieu.Ngaythanhtoan = DateTime.Now;
            }

            if (!string.IsNullOrWhiteSpace(dto.Hinhthuctt))
            {
                phieu.Hinhthuctt = dto.Hinhthuctt.Trim();
            }

            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Cập nhật trạng thái phiếu thanh toán thành công.",
                maPhieu = phieu.Maphieu,
                trangThai = phieu.Trangthai
            });
        }


        // GET: api/PhieuThanhToan/ThongKeDoanhThu
        [HttpGet("ThongKeDoanhThu")]
        public async Task<ActionResult<object>> ThongKeDoanhThu()
        {
            var tongDangKy = await _context.Dangkies.CountAsync();

            var danhSach = await (from dk in _context.Dangkies
                                  join lop in _context.Lophocs on dk.Malop equals lop.Malop
                                  join kh in _context.Khoahocs on lop.Makh equals kh.Makh
                                  let phieu = _context.Phieuthanhtoans
                                      .Where(p => p.Mahv == dk.Mahv && p.Malop == dk.Malop)
                                      .OrderByDescending(p => p.Ngaythanhtoan2)
                                      .FirstOrDefault()
                                  select new
                                  {
                                      maKhoaHoc = kh.Makh,
                                      tenKhoaHoc = kh.Tenkh,
                                      hocPhi = kh.Hocphi ?? 0,
                                      daThanhToan = phieu != null && phieu.Trangthai == "DA_THANH_TOAN",
                                      ngayThanhToan = phieu != null ? phieu.Ngaythanhtoan : null
                                  }).ToListAsync();

            var tongDoanhThu = danhSach
                .Where(x => x.daThanhToan)
                .Sum(x => x.hocPhi);

            var tongCongNo = danhSach
                .Where(x => !x.daThanhToan)
                .Sum(x => x.hocPhi);

            var tongDaThanhToan = danhSach.Count(x => x.daThanhToan);

            var theoThang = danhSach
                .Where(x => x.daThanhToan && x.ngayThanhToan.HasValue)
                .GroupBy(x => x.ngayThanhToan!.Value.ToString("MM/yyyy"))
                .Select(g => new
                {
                    thang = g.Key,
                    doanhThu = g.Sum(x => x.hocPhi),
                    soPhieu = g.Count()
                })
                .OrderBy(x => x.thang)
                .ToList();

            var theoKhoaHoc = danhSach
                .GroupBy(x => new { x.maKhoaHoc, x.tenKhoaHoc })
                .Select(g => new
                {
                    maKhoaHoc = g.Key.maKhoaHoc,
                    tenKhoaHoc = g.Key.tenKhoaHoc,
                    soDangKy = g.Count(),
                    daThanhToan = g.Count(x => x.daThanhToan),
                    chuaThanhToan = g.Count(x => !x.daThanhToan),
                    doanhThu = g.Where(x => x.daThanhToan).Sum(x => x.hocPhi),
                    congNo = g.Where(x => !x.daThanhToan).Sum(x => x.hocPhi)
                })
                .OrderByDescending(x => x.doanhThu)
                .ToList();

            return Ok(new
            {
                tongDoanhThu,
                tongCongNo,
                tongDangKy,
                tongDaThanhToan,
                theoThang,
                theoKhoaHoc
            });
        }

        private bool TrangThaiHopLe(string trangThai)
        {
            return trangThai == "CHUA_THANH_TOAN" ||
                   trangThai == "CHO_XAC_NHAN" ||
                   trangThai == "DA_THANH_TOAN" ||
                   trangThai == "HUY";
        }

        private async Task<string> GenerateMaPhieuAsync()
        {
            var maxMaPhieu = await _context.Phieuthanhtoans
                .Where(p => p.Maphieu.StartsWith("PT"))
                .OrderByDescending(p => p.Maphieu)
                .Select(p => p.Maphieu)
                .FirstOrDefaultAsync();

            if (string.IsNullOrWhiteSpace(maxMaPhieu))
            {
                return "PT001";
            }

            var numberPart = maxMaPhieu.Substring(2);

            if (int.TryParse(numberPart, out int number))
            {
                return $"PT{number + 1:000}";
            }

            return $"PT{DateTime.Now:yyyyMMddHHmmss}";
        }
    }

    public class PhieuThanhToanDTO
    {
        public string? Mahv { get; set; }
        public string? Manv2 { get; set; }
        public string? Malop { get; set; }
        public string? Hinhthuctt { get; set; }
        public string? Trangthai { get; set; }
    }

    public class TaoPhieuSauKhiDuyetDTO
    {
        public string Mahv { get; set; } = null!;
        public string Malop { get; set; } = null!;
        public string? Manv2 { get; set; }
    }

    public class DoiTrangThaiPhieuDTO
    {
        public string Mahv { get; set; } = null!;
        public string Malop { get; set; } = null!;
        public string Manv2 { get; set; } = null!;
        public string TrangThai { get; set; } = null!;
        public string? Hinhthuctt { get; set; }
    }
}