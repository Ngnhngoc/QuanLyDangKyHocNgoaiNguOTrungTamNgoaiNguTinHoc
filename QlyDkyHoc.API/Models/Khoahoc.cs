using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Models;

public partial class Khoahoc
{
    public string Makh { get; set; } = null!;

    public string Madanhmuc { get; set; } = null!;

    public string? Tenkh { get; set; }

    public string? Mota { get; set; }

    public DateTime? Ngaybdau { get; set; }

    public DateTime? Ngaykthuc { get; set; }

    public decimal? Hocphi { get; set; }



    public virtual ICollection<Lophoc> Lophocs { get; set; } = new List<Lophoc>();

public virtual Danhmucnn? MadanhmucNavigation { get; set; } // Thêm dấu ? ở đây

    public virtual ICollection<Quanly> Quanlies { get; set; } = new List<Quanly>();
}
