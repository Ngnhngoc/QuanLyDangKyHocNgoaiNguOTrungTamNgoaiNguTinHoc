using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Trinhdo
{
    public string Matd { get; set; } = null!;

    public string? Tentd { get; set; }

    public virtual ICollection<Dangky> Dangkies { get; set; } = new List<Dangky>();
}
