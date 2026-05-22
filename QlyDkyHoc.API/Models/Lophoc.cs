using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Models;

public partial class Lophoc
{
    public string Malop { get; set; } = null!;

    public string Makh { get; set; } = null!;

    public string? Tenlop { get; set; }

    public int? Soluong { get; set; }
    public string? Ngayhoc { get; set; }
    public string? Giohoc { get; set; }
// Đổi tên ở đây:
    public DateTime? Ngaybdhoc { get; set; }
public int? Siso { get; set; }
    public virtual ICollection<Giangday> Giangdays { get; set; } = new List<Giangday>();

    public virtual ICollection<Hocvien> Hocviens { get; set; } = new List<Hocvien>();

    [JsonIgnore] // Thêm dòng này vào đây
    public virtual Khoahoc? MakhNavigation { get; set; }
    public virtual ICollection<Dangky> Dangkies { get; set; } = new List<Dangky>();
}
