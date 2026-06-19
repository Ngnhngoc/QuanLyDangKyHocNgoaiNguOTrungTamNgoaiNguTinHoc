using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Models;

public partial class Phieuthanhtoan
{
    public string Maphieu { get; set; } = null!;

    public string Mahv { get; set; } = null!;

    public string Manv2 { get; set; } = null!;

    public string? Malop { get; set; }

    public DateTime? Ngaythanhtoan { get; set; }

    public string? Hinhthuctt { get; set; }

    public string? Trangthai { get; set; }

    public DateTime? Ngaythanhtoan2 { get; set; }

    [JsonIgnore]
    public virtual Hocvien MahvNavigation { get; set; } = null!;

    [JsonIgnore]
    public virtual Nhanvien Manv2Navigation { get; set; } = null!;
}
