using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Cotrinhdo
{
    public string Macm { get; set; } = null!;

    public string Matdcm { get; set; } = null!;

    public string Mavc { get; set; } = null!;

    public DateTime? Namtotnghiep { get; set; }

    public string? Xeploai { get; set; }

    public virtual Chuyenmon MacmNavigation { get; set; } = null!;

    public virtual Trinhdocm MatdcmNavigation { get; set; } = null!;

    public virtual Vienchuc MavcNavigation { get; set; } = null!;
}
