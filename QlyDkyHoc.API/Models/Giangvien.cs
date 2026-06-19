using System;
using System.Collections.Generic;

namespace QlyDkyHoc.API.Models;

public partial class Giangvien
{
    public string Magv { get; set; } = null!;

    public string? Tennv { get; set; }

    public DateTime? Ngaysinhhv { get; set; }

    public string? Gioitinhhv { get; set; }

    public string? Sdtnv { get; set; }

    public string? Diachinv { get; set; }

    public string? Matkhaunv { get; set; }

    public string? Chuyenmon { get; set; }
    public string? Emailnv { get; set; }
    public string? Hinhanh { get; set; }

    public virtual ICollection<Giangday> Giangdays { get; set; } = new List<Giangday>();
}
