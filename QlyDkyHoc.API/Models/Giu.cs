using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Giu
{
    public string Macv { get; set; } = null!;

    public string Mavc { get; set; } = null!;

    public DateTime? Ngaybdau { get; set; }

    public DateTime? Ngaykthuc { get; set; }

    public virtual Chucvu MacvNavigation { get; set; } = null!;

    public virtual Vienchuc MavcNavigation { get; set; } = null!;
}
