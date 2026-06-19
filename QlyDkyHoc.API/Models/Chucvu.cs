using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Chucvu
{
    public string Macv { get; set; } = null!;

    public string? Tencv { get; set; }

    public string? Danhmuccv { get; set; }

    public virtual ICollection<Giu> Gius { get; set; } = new List<Giu>();
}
