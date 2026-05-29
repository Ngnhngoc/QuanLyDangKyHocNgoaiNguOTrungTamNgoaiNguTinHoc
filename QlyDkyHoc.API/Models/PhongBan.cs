using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class PhongBan
{
    public string MaPhongBan { get; set; } = null!;

    public string? TenPhongBan { get; set; }

    public string? Sdt { get; set; }

    public virtual ICollection<Thuoc> Thuocs { get; set; } = new List<Thuoc>();
}
