using System;
using System.Collections.Generic;
using System.Text.Json.Serialization; // 1. NHỚ THÊM DÒNG NÀY LÊN ĐẦU FILE NHA

namespace QlyDkyHoc.API.Models;

public partial class Hocvien
{
    public string Mahv { get; set; } = null!;
    public string Malop { get; set; } = null!;
    public string? Hotenhv { get; set; }
    public DateTime? Ngaysinhhv { get; set; }
    public string? Gioitinhhv { get; set; }
    public string? Dienthoaihv { get; set; }
    public string? Diachinv { get; set; }
    public string? Emailhv { get; set; }
    public string? Matkhauhv { get; set; }
    public DateTime? Ngayhoc { get; set; }
    public string? Buoihoc { get; set; }

    // 2. GẮN BÙA [JsonIgnore] VÀO 3 CÁI LIÊN KẾT NÀY
    [JsonIgnore]
    public virtual ICollection<Dangky> Dangkies { get; set; } = new List<Dangky>();

    [JsonIgnore]
    public virtual Lophoc? MalopNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Phieuthanhtoan> Phieuthanhtoans { get; set; } = new List<Phieuthanhtoan>();
}