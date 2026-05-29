using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace QlyDkyHoc.API.Models
{
    public partial class Dangky
    {
        public string Mahv { get; set; } = null!; // Mã học viên
        public string Malop { get; set; } = null!; // Mã lớp học
        public DateTime? Ngaydangky { get; set; } // Ngày ghi danh

        public int? TrangThai { get; set; } // 0: Chưa thanh toán, 1: Đã thanh toán, 2: Hủy đăng ký

        // Nếu em có tạo quan hệ (Navigation Properties) thì để thêm:
        // 👉 GẮN BIỂN BÁO KHÓA NGOẠI VÀO ĐÂY
        [ForeignKey("Mahv")]
        public virtual Hocvien? MahvNavigation { get; set; }

        [ForeignKey("Malop")]
        public virtual Lophoc? MalopNavigation { get; set; } 
    }
    }