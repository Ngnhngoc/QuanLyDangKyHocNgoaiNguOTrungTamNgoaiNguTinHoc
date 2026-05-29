using System.Text.Json.Serialization;

namespace QlyDkyHoc.API.Models;

public partial class Danhmucnn
{
    public string Madanhmuc { get; set; } = null!;

    public string? Tendanhmuc { get; set; }

[JsonIgnore]
public virtual ICollection<Khoahoc>? Khoahocs { get; set; } = new List<Khoahoc>();
}
