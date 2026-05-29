using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Thuoc
{
    public string MaPhongBan { get; set; } = null!;

    public string Mavc { get; set; } = null!;

    public DateTime? Ngaybdaulam { get; set; }

    public DateTime? Ngaykthuclam { get; set; }

    public virtual PhongBan MaPhongBanNavigation { get; set; } = null!;

    public virtual Vienchuc MavcNavigation { get; set; } = null!;
}
