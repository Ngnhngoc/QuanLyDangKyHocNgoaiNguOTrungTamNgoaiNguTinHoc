using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Quanly
{
    public string Manv2 { get; set; } = null!;

    public string Makh { get; set; } = null!;

    public DateTime? Thoigianhoc { get; set; }

    public virtual Khoahoc MakhNavigation { get; set; } = null!;

    public virtual Nhanvien Manv2Navigation { get; set; } = null!;
}
