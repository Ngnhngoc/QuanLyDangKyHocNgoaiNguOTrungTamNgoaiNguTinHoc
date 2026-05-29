using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Trinhdocm
{
    public string Matdcm { get; set; } = null!;

    public string? Tentdcm { get; set; }

    public string? Capbac { get; set; }

    public virtual ICollection<Cotrinhdo> Cotrinhdos { get; set; } = new List<Cotrinhdo>();
}
