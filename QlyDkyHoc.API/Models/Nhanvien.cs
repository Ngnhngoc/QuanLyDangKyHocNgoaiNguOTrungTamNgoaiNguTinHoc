using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Nhanvien
{
    public string Manv2 { get; set; } = null!;

    public string? Tennv { get; set; }

    public DateTime? Ngaysinhhv { get; set; }

    public string? Gioitinhhv { get; set; }

    public string? Sdtnv { get; set; }

    public string? Diachinv { get; set; }

    public string? Matkhaunv { get; set; }

    public virtual ICollection<Phieuthanhtoan> Phieuthanhtoans { get; set; } = new List<Phieuthanhtoan>();

    public virtual ICollection<Quanly> Quanlies { get; set; } = new List<Quanly>();
}
