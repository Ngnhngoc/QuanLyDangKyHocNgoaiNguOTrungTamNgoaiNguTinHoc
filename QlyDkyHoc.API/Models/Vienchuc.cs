using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Vienchuc
{
    public string Mavc { get; set; } = null!;

    public string? Tenvc { get; set; }

    public DateTime? Ngaysinh { get; set; }

    public string? Gioitinh { get; set; }

    public string? Sdt { get; set; }

    public string? Diachi { get; set; }

    public string? Matkhauvc { get; set; }

    public virtual ICollection<Cotrinhdo> Cotrinhdos { get; set; } = new List<Cotrinhdo>();

    public virtual ICollection<Giangday> Giangdays { get; set; } = new List<Giangday>();

    public virtual ICollection<Giu> Gius { get; set; } = new List<Giu>();

    public virtual ICollection<Phieuthanhtoan> Phieuthanhtoans { get; set; } = new List<Phieuthanhtoan>();

    public virtual ICollection<Thuoc> Thuocs { get; set; } = new List<Thuoc>();
}
