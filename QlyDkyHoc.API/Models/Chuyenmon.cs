using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Chuyenmon
{
    public string Macm { get; set; } = null!;

    public string? Tencm { get; set; }

    public string? Linhvuc { get; set; }

    public virtual ICollection<Cotrinhdo> Cotrinhdos { get; set; } = new List<Cotrinhdo>();
}
