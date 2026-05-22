using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Phieuthanhtoan
{
    public string Maphieu { get; set; } = null!;

    public string Mahv { get; set; } = null!;

    public string Manv2 { get; set; } = null!;

    public DateTime? Ngaythanhtoan { get; set; }

    public string? Hinhthuctt { get; set; }

    public DateTime? Ngaythanhtoan2 { get; set; }

    public virtual Hocvien MahvNavigation { get; set; } = null!;

    public virtual Nhanvien Manv2Navigation { get; set; } = null!;
}
