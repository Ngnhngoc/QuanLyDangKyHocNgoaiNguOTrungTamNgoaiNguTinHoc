using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Gom
{
    public string Makh { get; set; } = null!;

    public string Madanhmuc { get; set; } = null!;

    public string? Trangthai { get; set; }

    public virtual Danhmucnn MadanhmucNavigation { get; set; } = null!;

    public virtual Khoahoc MakhNavigation { get; set; } = null!;
}
