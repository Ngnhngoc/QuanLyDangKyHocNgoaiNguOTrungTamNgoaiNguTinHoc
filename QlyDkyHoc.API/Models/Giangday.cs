using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Giangday
{
    public string Malop { get; set; } = null!;

    public string Magv { get; set; } = null!;

    public string? Buoiday { get; set; }

    public DateTime? Ngayday { get; set; }

    public virtual Giangvien MagvNavigation { get; set; } = null!;

    public virtual Lophoc MalopNavigation { get; set; } = null!;
}
