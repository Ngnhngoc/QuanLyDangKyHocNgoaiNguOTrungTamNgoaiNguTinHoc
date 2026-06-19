using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace QlyDkyHoc.API.Models;

public partial class QlyDkyHocContext : DbContext
{
    public QlyDkyHocContext()
    {
    }

    public QlyDkyHocContext(DbContextOptions<QlyDkyHocContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Dangky> Dangkies { get; set; }

    public virtual DbSet<Danhmucnn> Danhmucnns { get; set; }

    public virtual DbSet<Giangday> Giangdays { get; set; }

    public virtual DbSet<Giangvien> Giangviens { get; set; }

    public virtual DbSet<Hocvien> Hocviens { get; set; }

    public virtual DbSet<Khoahoc> Khoahocs { get; set; }

    public virtual DbSet<Lophoc> Lophocs { get; set; }

    public virtual DbSet<Nhanvien> Nhanviens { get; set; }

    public virtual DbSet<Phieuthanhtoan> Phieuthanhtoans { get; set; }

    public virtual DbSet<Quanly> Quanlies { get; set; }

protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Connection string được config từ Program.cs, không cần hardcode ở đây
    }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
modelBuilder.Entity<Dangky>(entity =>
{
    entity.HasKey(e => new { e.Mahv, e.Malop }).HasName("PK_DANGKY");

    entity.ToTable("DANGKY");

    entity.Property(e => e.Mahv)
        .HasMaxLength(255)
        .IsUnicode(true)
        .HasColumnName("MAHV");

    entity.Property(e => e.Malop)
        .HasMaxLength(255)
        .IsUnicode(true)
        .HasColumnName("MALOP");

    entity.Property(e => e.Ngaydangky)
        .HasColumnType("datetime")
        .HasColumnName("NGAYDANGKY");

    entity.Property(e => e.TrangThai)
        .HasColumnName("TRANGTHAI");

    // Liên kết với bảng Hocvien
    entity.HasOne(d => d.MahvNavigation).WithMany(p => p.Dangkies)
        .HasForeignKey(d => d.Mahv)
        .OnDelete(DeleteBehavior.ClientSetNull)
        .HasConstraintName("FK_DANGKY_HOCVIEN");

    // Liên kết với bảng Lophoc (Đã đổi sang Malop)
    entity.HasOne(d => d.MalopNavigation).WithMany(p => p.Dangkies)
        .HasForeignKey(d => d.Malop)
        .OnDelete(DeleteBehavior.ClientSetNull)
        .HasConstraintName("FK_DangKy_LopHoc");
});

        modelBuilder.Entity<Danhmucnn>(entity =>
        {
            entity.HasKey(e => e.Madanhmuc);

            entity.ToTable("DANHMUCNN");

            entity.Property(e => e.Madanhmuc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MADANHMUC");
            entity.Property(e => e.Tendanhmuc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("TENDANHMUC");
        });

        modelBuilder.Entity<Giangday>(entity =>
        {
            entity.HasKey(e => new { e.Malop, e.Magv });

            entity.ToTable("GIANGDAY");

            entity.HasIndex(e => e.Magv, "GIANGDAY2_FK");

            entity.HasIndex(e => e.Malop, "GIANGDAY_FK");

            entity.Property(e => e.Malop)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MALOP");
            entity.Property(e => e.Magv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAGV");
            entity.Property(e => e.Buoiday)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("BUOIDAY");
            entity.Property(e => e.Ngayday)
                .HasColumnType("datetime")
                .HasColumnName("NGAYDAY");

            entity.HasOne(d => d.MagvNavigation).WithMany(p => p.Giangdays)
                .HasForeignKey(d => d.Magv)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GIANGDAY_GIANGDAY2_GIANGVIE");

            entity.HasOne(d => d.MalopNavigation).WithMany(p => p.Giangdays)
                .HasForeignKey(d => d.Malop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_GIANGDAY_GIANGDAY_LOPHOC");
        });

        modelBuilder.Entity<Giangvien>(entity =>
        {
            entity.HasKey(e => e.Magv);

            entity.ToTable("GIANGVIEN");

            entity.Property(e => e.Magv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAGV");
            entity.Property(e => e.Chuyenmon)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("CHUYENMON");
            entity.Property(e => e.Diachinv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("DIACHINV");
            entity.Property(e => e.Gioitinhhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("GIOITINHHV");
            entity.Property(e => e.Matkhaunv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MATKHAUNV");
            entity.Property(e => e.Ngaysinhhv)
                .HasColumnType("datetime")
                .HasColumnName("NGAYSINHHV");
            entity.Property(e => e.Sdtnv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("SDTNV");
            entity.Property(e => e.Tennv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("TENNV");
            entity.Property(e => e.Emailnv)
            .HasMaxLength(50)
            .IsUnicode(false) // Email thì không cần có dấu tiếng Việt
            .HasColumnName("EMAILNV");

             entity.Property(e => e.Hinhanh)
            .IsUnicode(true)
            .HasColumnName("HINHANH");

        });

        modelBuilder.Entity<Hocvien>(entity =>
        {
            entity.HasKey(e => e.Mahv);

            entity.ToTable("HOCVIEN");

            entity.HasIndex(e => e.Malop, "HOC_FK");

            entity.Property(e => e.Mahv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAHV");
            entity.Property(e => e.Buoihoc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("BUOIHOC");
            entity.Property(e => e.Diachinv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("DIACHINV");
            entity.Property(e => e.Dienthoaihv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("DIENTHOAIHV");
            entity.Property(e => e.Emailhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("EMAILHV");
            entity.Property(e => e.Gioitinhhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("GIOITINHHV");
            entity.Property(e => e.Hotenhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("HOTENHV");
            entity.Property(e => e.Malop)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MALOP");
            entity.Property(e => e.Matkhauhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MATKHAUHV");
            entity.Property(e => e.Ngayhoc)
                .HasColumnType("datetime")
                .HasColumnName("NGAYHOC");
            entity.Property(e => e.Ngaysinhhv)
                .HasColumnType("datetime")
                .HasColumnName("NGAYSINHHV");

            entity.HasOne(d => d.MalopNavigation).WithMany(p => p.Hocviens)
                .HasForeignKey(d => d.Malop)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_HOCVIEN_HOC_LOPHOC");
        });

        modelBuilder.Entity<Khoahoc>(entity =>
        {
            entity.HasKey(e => e.Makh);

            entity.ToTable("KHOAHOC");

            entity.HasIndex(e => e.Madanhmuc, "GOM_FK");

            entity.Property(e => e.Makh)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAKH");
            entity.Property(e => e.Hocphi)
                .HasColumnType("money")
                .HasColumnName("HOCPHI");
            entity.Property(e => e.Madanhmuc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MADANHMUC");
            entity.Property(e => e.Mota)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MOTA");
            entity.Property(e => e.Ngaybdau)
                .HasColumnType("datetime")
                .HasColumnName("NGAYBDAU");
            entity.Property(e => e.Ngaykthuc)
                .HasColumnType("datetime")
                .HasColumnName("NGAYKTHUC");
            entity.Property(e => e.Tenkh)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("TENKH");

            entity.HasOne(d => d.MadanhmucNavigation).WithMany(p => p.Khoahocs)
                .HasForeignKey(d => d.Madanhmuc)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_KHOAHOC_GOM_DANHMUCN");
        });

        modelBuilder.Entity<Lophoc>(entity =>
        {
            entity.HasKey(e => e.Malop);

            entity.ToTable("LOPHOC");

            entity.HasIndex(e => e.Makh, "CUA_FK");

            entity.Property(e => e.Malop)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MALOP");
            entity.Property(e => e.Makh)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAKH");
            entity.Property(e => e.Tenlop)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("TENLOP");
            entity.Property(e => e.Magv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAGV");
            entity.Property(e => e.Siso)
                .HasColumnName("SISO");
            entity.Property(e => e.Soluong)
                .HasColumnName("SOLUONG");
            entity.Property(e => e.Ngayhoc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("NGAYHOC");
            entity.Property(e => e.Giohoc)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("GIOHOC");
            entity.Property(e => e.Ngaybdhoc)
                .HasColumnType("datetime")
                .HasColumnName("NGAYBDHOC");

            entity.HasOne(d => d.MakhNavigation).WithMany(p => p.Lophocs)
                .HasForeignKey(d => d.Makh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_LOPHOC_CUA_KHOAHOC");
        });

        modelBuilder.Entity<Nhanvien>(entity =>
        {
            entity.HasKey(e => e.Manv2);

            entity.ToTable("NHANVIEN");

            entity.Property(e => e.Manv2)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MANV2");
            entity.Property(e => e.Diachinv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("DIACHINV");
            entity.Property(e => e.Gioitinhhv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("GIOITINHHV");
            entity.Property(e => e.Matkhaunv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MATKHAUNV");
            entity.Property(e => e.Ngaysinhhv)
                .HasColumnType("datetime")
                .HasColumnName("NGAYSINHHV");
            entity.Property(e => e.Sdtnv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("SDTNV");
            entity.Property(e => e.Tennv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("TENNV");
        });

        modelBuilder.Entity<Phieuthanhtoan>(entity =>
        {
            entity.HasKey(e => e.Maphieu);

            entity.ToTable("PHIEUTHANHTOAN");

            entity.HasIndex(e => e.Manv2, "LAPPHIEU_FK");

            entity.HasIndex(e => e.Mahv, "THANHTOAN_FK");

            entity.Property(e => e.Maphieu)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAPHIEU");
            entity.Property(e => e.Hinhthuctt)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("HINHTHUCTT");
            entity.Property(e => e.Mahv)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAHV");
            entity.Property(e => e.Malop)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MALOP");
            entity.Property(e => e.Manv2)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MANV2");
            entity.Property(e => e.Ngaythanhtoan)
                .HasColumnType("datetime")
                .HasColumnName("NGAYTHANHTOAN");
            entity.Property(e => e.Ngaythanhtoan2)
                .HasColumnType("datetime")
                .HasColumnName("NGAYTHANHTOAN2");
            entity.Property(e => e.Trangthai)
                .HasMaxLength(50)
                .IsUnicode(true)
                .HasColumnName("TRANGTHAI");

            entity.HasOne(d => d.MahvNavigation).WithMany(p => p.Phieuthanhtoans)
                .HasForeignKey(d => d.Mahv)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PHIEUTHA_THANHTOAN_HOCVIEN");

            entity.HasOne(d => d.Manv2Navigation).WithMany(p => p.Phieuthanhtoans)
                .HasForeignKey(d => d.Manv2)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_PHIEUTHA_LAPPHIEU_NHANVIEN");
        });

        modelBuilder.Entity<Quanly>(entity =>
        {
            entity.HasKey(e => new { e.Manv2, e.Makh });

            entity.ToTable("QUANLY");

            entity.HasIndex(e => e.Makh, "QUANLY2_FK");

            entity.HasIndex(e => e.Manv2, "QUANLY_FK");

            entity.Property(e => e.Manv2)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MANV2");
            entity.Property(e => e.Makh)
                .HasMaxLength(255)
                .IsUnicode(true)
                .HasColumnName("MAKH");
            entity.Property(e => e.Thoigianhoc)
                .HasColumnType("datetime")
                .HasColumnName("THOIGIANHOC");

            entity.HasOne(d => d.MakhNavigation).WithMany(p => p.Quanlies)
                .HasForeignKey(d => d.Makh)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QUANLY_QUANLY2_KHOAHOC");

            entity.HasOne(d => d.Manv2Navigation).WithMany(p => p.Quanlies)
                .HasForeignKey(d => d.Manv2)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_QUANLY_QUANLY_NHANVIEN");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
