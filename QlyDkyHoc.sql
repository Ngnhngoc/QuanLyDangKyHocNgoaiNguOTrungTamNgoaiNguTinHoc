/*==============================================================*/
/* DBMS name:      Microsoft SQL Server 2017                    */
/* Created on:     4/25/2026 10:54:46 PM                        */
/*==============================================================*/

create database QlyDkyHoc
go
use QlyDkyHoc
go

-- Thêm Trình độ (Rút gọn chữ còn 5 ký tự)
INSERT INTO TRINHDO (MATD, TENTD) 
VALUES ('A1', 'TD A1');

-- Thêm Lớp học (Rút gọn chữ còn 7 ký tự)
INSERT INTO LOPHOC (MALOP, TENLOP) 
VALUES ('L01', 'Lop CB1');

-- Thêm Học viên (Lúc này L01 đã tồn tại nên sẽ không bị lỗi khóa ngoại nữa)
INSERT INTO HOCVIEN (MAHV2, MALOP, HOTEN) 
VALUES ('HV001', 'L01', 'Ngoc Nguyen');


if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('COTRINHDO') and o.name = 'FK_COTRINHD_COTRINHDO_CHUYENMO')
alter table COTRINHDO
   drop constraint FK_COTRINHD_COTRINHDO_CHUYENMO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('COTRINHDO') and o.name = 'FK_COTRINHD_COTRINHDO_TRINHDOC')
alter table COTRINHDO
   drop constraint FK_COTRINHD_COTRINHDO_TRINHDOC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('COTRINHDO') and o.name = 'FK_COTRINHD_COTRINHDO_VIENCHUC')
alter table COTRINHDO
   drop constraint FK_COTRINHD_COTRINHDO_VIENCHUC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('DANGKY') and o.name = 'FK_DANGKY_DANGKY_DANHMUCN')
alter table DANGKY
   drop constraint FK_DANGKY_DANGKY_DANHMUCN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('DANGKY') and o.name = 'FK_DANGKY_DANGKY2_TRINHDO')
alter table DANGKY
   drop constraint FK_DANGKY_DANGKY2_TRINHDO
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('DANGKY') and o.name = 'FK_DANGKY_DANGKY3_HOCVIEN')
alter table DANGKY
   drop constraint FK_DANGKY_DANGKY3_HOCVIEN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GIANGDAY') and o.name = 'FK_GIANGDAY_GIANGDAY_LOPHOC')
alter table GIANGDAY
   drop constraint FK_GIANGDAY_GIANGDAY_LOPHOC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GIANGDAY') and o.name = 'FK_GIANGDAY_GIANGDAY2_VIENCHUC')
alter table GIANGDAY
   drop constraint FK_GIANGDAY_GIANGDAY2_VIENCHUC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GIU') and o.name = 'FK_GIU_GIU_CHUCVU')
alter table GIU
   drop constraint FK_GIU_GIU_CHUCVU
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GIU') and o.name = 'FK_GIU_GIU2_VIENCHUC')
alter table GIU
   drop constraint FK_GIU_GIU2_VIENCHUC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GOM') and o.name = 'FK_GOM_GOM_KHOAHOC')
alter table GOM
   drop constraint FK_GOM_GOM_KHOAHOC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('GOM') and o.name = 'FK_GOM_GOM2_DANHMUCN')
alter table GOM
   drop constraint FK_GOM_GOM2_DANHMUCN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('HOCVIEN') and o.name = 'FK_HOCVIEN_CO_LOPHOC')
alter table HOCVIEN
   drop constraint FK_HOCVIEN_CO_LOPHOC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PHIEUTHANHTOAN') and o.name = 'FK_PHIEUTHA_LAPPHIEU_VIENCHUC')
alter table PHIEUTHANHTOAN
   drop constraint FK_PHIEUTHA_LAPPHIEU_VIENCHUC
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('PHIEUTHANHTOAN') and o.name = 'FK_PHIEUTHA_THANHTOAN_HOCVIEN')
alter table PHIEUTHANHTOAN
   drop constraint FK_PHIEUTHA_THANHTOAN_HOCVIEN
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('THUOC') and o.name = 'FK_THUOC_THUOC_PHONG_BA')
alter table THUOC
   drop constraint FK_THUOC_THUOC_PHONG_BA
go

if exists (select 1
   from sys.sysreferences r join sys.sysobjects o on (o.id = r.constid and o.type = 'F')
   where r.fkeyid = object_id('THUOC') and o.name = 'FK_THUOC_THUOC2_VIENCHUC')
alter table THUOC
   drop constraint FK_THUOC_THUOC2_VIENCHUC
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CHUCVU')
            and   type = 'U')
   drop table CHUCVU
go

if exists (select 1
            from  sysobjects
           where  id = object_id('CHUYENMON')
            and   type = 'U')
   drop table CHUYENMON
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('COTRINHDO')
            and   name  = 'COTRINHDO3_FK'
            and   indid > 0
            and   indid < 255)
   drop index COTRINHDO.COTRINHDO3_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('COTRINHDO')
            and   name  = 'COTRINHDO2_FK'
            and   indid > 0
            and   indid < 255)
   drop index COTRINHDO.COTRINHDO2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('COTRINHDO')
            and   name  = 'COTRINHDO_FK'
            and   indid > 0
            and   indid < 255)
   drop index COTRINHDO.COTRINHDO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('COTRINHDO')
            and   type = 'U')
   drop table COTRINHDO
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('DANGKY')
            and   name  = 'DANGKY3_FK'
            and   indid > 0
            and   indid < 255)
   drop index DANGKY.DANGKY3_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('DANGKY')
            and   name  = 'DANGKY2_FK'
            and   indid > 0
            and   indid < 255)
   drop index DANGKY.DANGKY2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('DANGKY')
            and   name  = 'DANGKY_FK'
            and   indid > 0
            and   indid < 255)
   drop index DANGKY.DANGKY_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('DANGKY')
            and   type = 'U')
   drop table DANGKY
go

if exists (select 1
            from  sysobjects
           where  id = object_id('DANHMUCNN')
            and   type = 'U')
   drop table DANHMUCNN
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GIANGDAY')
            and   name  = 'GIANGDAY2_FK'
            and   indid > 0
            and   indid < 255)
   drop index GIANGDAY.GIANGDAY2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GIANGDAY')
            and   name  = 'GIANGDAY_FK'
            and   indid > 0
            and   indid < 255)
   drop index GIANGDAY.GIANGDAY_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('GIANGDAY')
            and   type = 'U')
   drop table GIANGDAY
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GIU')
            and   name  = 'GIU2_FK'
            and   indid > 0
            and   indid < 255)
   drop index GIU.GIU2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GIU')
            and   name  = 'GIU_FK'
            and   indid > 0
            and   indid < 255)
   drop index GIU.GIU_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('GIU')
            and   type = 'U')
   drop table GIU
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GOM')
            and   name  = 'GOM2_FK'
            and   indid > 0
            and   indid < 255)
   drop index GOM.GOM2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('GOM')
            and   name  = 'GOM_FK'
            and   indid > 0
            and   indid < 255)
   drop index GOM.GOM_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('GOM')
            and   type = 'U')
   drop table GOM
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('HOCVIEN')
            and   name  = 'CO_FK'
            and   indid > 0
            and   indid < 255)
   drop index HOCVIEN.CO_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('HOCVIEN')
            and   type = 'U')
   drop table HOCVIEN
go

if exists (select 1
            from  sysobjects
           where  id = object_id('KHOAHOC')
            and   type = 'U')
   drop table KHOAHOC
go

if exists (select 1
            from  sysobjects
           where  id = object_id('LOPHOC')
            and   type = 'U')
   drop table LOPHOC
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('PHIEUTHANHTOAN')
            and   name  = 'THANHTOAN_FK'
            and   indid > 0
            and   indid < 255)
   drop index PHIEUTHANHTOAN.THANHTOAN_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('PHIEUTHANHTOAN')
            and   name  = 'LAPPHIEU_FK'
            and   indid > 0
            and   indid < 255)
   drop index PHIEUTHANHTOAN.LAPPHIEU_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PHIEUTHANHTOAN')
            and   type = 'U')
   drop table PHIEUTHANHTOAN
go

if exists (select 1
            from  sysobjects
           where  id = object_id('PHONG_BAN')
            and   type = 'U')
   drop table PHONG_BAN
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('THUOC')
            and   name  = 'THUOC2_FK'
            and   indid > 0
            and   indid < 255)
   drop index THUOC.THUOC2_FK
go

if exists (select 1
            from  sysindexes
           where  id    = object_id('THUOC')
            and   name  = 'THUOC_FK'
            and   indid > 0
            and   indid < 255)
   drop index THUOC.THUOC_FK
go

if exists (select 1
            from  sysobjects
           where  id = object_id('THUOC')
            and   type = 'U')
   drop table THUOC
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TRINHDO')
            and   type = 'U')
   drop table TRINHDO
go

if exists (select 1
            from  sysobjects
           where  id = object_id('TRINHDOCM')
            and   type = 'U')
   drop table TRINHDOCM
go

if exists (select 1
            from  sysobjects
           where  id = object_id('VIENCHUC')
            and   type = 'U')
   drop table VIENCHUC
go

/*==============================================================*/
/* Table: CHUCVU                                                */
/*==============================================================*/
create table CHUCVU (
   MACV                 nvarchar(10)          not null,
   TENCV                nvarchar(10)          null,
   DANHMUCCV            nvarchar(10)          null,
   constraint PK_CHUCVU primary key (MACV)
)
go

/*==============================================================*/
/* Table: CHUYENMON                                             */
/*==============================================================*/
create table CHUYENMON (
   MACM                 nvarchar(5)           not null,
   TENCM                nvarchar(5)           null,
   LINHVUC              nvarchar(5)           null,
   constraint PK_CHUYENMON primary key (MACM)
)
go

/*==============================================================*/
/* Table: COTRINHDO                                             */
/*==============================================================*/
create table COTRINHDO (
   MACM                 nvarchar(5)           not null,
   MATDCM               nvarchar(10)          not null,
   MAVC                 nvarchar(10)          not null,
   NAMTOTNGHIEP         datetime             null,
   XEPLOAI              nvarchar(2)           null,
   constraint PK_COTRINHDO primary key (MACM, MATDCM, MAVC)
)
go

/*==============================================================*/
/* Index: COTRINHDO_FK                                          */
/*==============================================================*/




create nonclustered index COTRINHDO_FK on COTRINHDO (MACM ASC)
go

/*==============================================================*/
/* Index: COTRINHDO2_FK                                         */
/*==============================================================*/




create nonclustered index COTRINHDO2_FK on COTRINHDO (MATDCM ASC)
go

/*==============================================================*/
/* Index: COTRINHDO3_FK                                         */
/*==============================================================*/




create nonclustered index COTRINHDO3_FK on COTRINHDO (MAVC ASC)
go

/*==============================================================*/
/* Table: DANGKY                                                */
/*==============================================================*/
create table DANGKY (
   MADANHMUC            nvarchar(2)           not null,
   MATD                 nvarchar(10)          not null,
   MAHV2                nvarchar(20)          not null,
   NGAYDANGKY           datetime             null,
   MUCHOCPHI            float                null,
   constraint PK_DANGKY primary key (MADANHMUC, MATD, MAHV2)
)
go

/*==============================================================*/
/* Index: DANGKY_FK                                             */
/*==============================================================*/




create nonclustered index DANGKY_FK on DANGKY (MADANHMUC ASC)
go

/*==============================================================*/
/* Index: DANGKY2_FK                                            */
/*==============================================================*/




create nonclustered index DANGKY2_FK on DANGKY (MATD ASC)
go

/*==============================================================*/
/* Index: DANGKY3_FK                                            */
/*==============================================================*/




create nonclustered index DANGKY3_FK on DANGKY (MAHV2 ASC)
go

/*==============================================================*/
/* Table: DANHMUCNN                                             */
/*==============================================================*/
create table DANHMUCNN (
   MADANHMUC            nvarchar(2)           not null,
   TENDANHMUC           nvarchar(10)          null,
   MOTA                 nvarchar(30)          null,
   constraint PK_DANHMUCNN primary key (MADANHMUC)
)
go

/*==============================================================*/
/* Table: GIANGDAY                                              */
/*==============================================================*/
create table GIANGDAY (
   MALOP                nvarchar(10)          not null,
   MAVC                 nvarchar(10)          not null,
   BUOIDAY              nvarchar(10)          null,
   NGAYDAY              datetime             null,
   PHONG                nvarchar(2)           null,
   constraint PK_GIANGDAY primary key (MALOP, MAVC)
)
go

/*==============================================================*/
/* Index: GIANGDAY_FK                                           */
/*==============================================================*/




create nonclustered index GIANGDAY_FK on GIANGDAY (MALOP ASC)
go

/*==============================================================*/
/* Index: GIANGDAY2_FK                                          */
/*==============================================================*/




create nonclustered index GIANGDAY2_FK on GIANGDAY (MAVC ASC)
go

/*==============================================================*/
/* Table: GIU                                                   */
/*==============================================================*/
create table GIU (
   MACV                 nvarchar(10)          not null,
   MAVC                 nvarchar(10)          not null,
   NGAYBDAU             datetime             null,
   NGAYKTHUC            datetime             null,
   constraint PK_GIU primary key (MACV, MAVC)
)
go

/*==============================================================*/
/* Index: GIU_FK                                                */
/*==============================================================*/




create nonclustered index GIU_FK on GIU (MACV ASC)
go

/*==============================================================*/
/* Index: GIU2_FK                                               */
/*==============================================================*/




create nonclustered index GIU2_FK on GIU (MAVC ASC)
go

/*==============================================================*/
/* Table: GOM                                                   */
/*==============================================================*/
create table GOM (
   MAKH                 nvarchar(10)          not null,
   MADANHMUC            nvarchar(2)           not null,
   TRANGTHAI            nvarchar(10)          null,
   constraint PK_GOM primary key (MAKH, MADANHMUC)
)
go

/*==============================================================*/
/* Index: GOM_FK                                                */
/*==============================================================*/




create nonclustered index GOM_FK on GOM (MAKH ASC)
go

/*==============================================================*/
/* Index: GOM2_FK                                               */
/*==============================================================*/




create nonclustered index GOM2_FK on GOM (MADANHMUC ASC)
go

/*==============================================================*/
/* Table: HOCVIEN                                               */
/*==============================================================*/
create table HOCVIEN (
   MAHV2                nvarchar(20)          not null,
   MALOP                nvarchar(10)          not null,
   HOTEN                nvarchar(30)          null,
   NGAYSINH             datetime             null,
   GIOITINH             nvarchar(10)          null,
   DIENTHOAI            nvarchar(10)          null,
   DIACHI               nvarchar(50)          null,
   EMAIL                nvarchar(30)          null,
   MATKHAUHV            nvarchar(30)          null,
   constraint PK_HOCVIEN primary key (MAHV2)
)
go

/*==============================================================*/
/* Index: CO_FK                                                 */
/*==============================================================*/




create nonclustered index CO_FK on HOCVIEN (MALOP ASC)
go

/*==============================================================*/
/* Table: KHOAHOC                                               */
/*==============================================================*/
create table KHOAHOC (
   MAKH                 nvarchar(10)          not null,
   TENKH                nvarchar(20)          null,
   MOTA                 nvarchar(30)          null,
   NGAYBDAU             datetime             null,
   NGAYKTHUC            datetime             null,
   constraint PK_KHOAHOC primary key (MAKH)
)
go

/*==============================================================*/
/* Table: LOPHOC                                                */
/*==============================================================*/
create table LOPHOC (
   MALOP                nvarchar(10)          not null,
   TENLOP               nvarchar(10)          null,
   BUOIHOC              nvarchar(5)           null,
   NGAYBDAU             datetime             null,
   NGAYKTHUC            datetime             null,
   constraint PK_LOPHOC primary key (MALOP)
)
go

/*==============================================================*/
/* Table: PHIEUTHANHTOAN                                        */
/*==============================================================*/
create table PHIEUTHANHTOAN (
   MAPHIEU              nvarchar(10)          not null,
   MAHV2                nvarchar(20)          not null,
   MAVC                 nvarchar(10)          not null,
   NGAYTHANHTOAN        datetime             null,
   HINHTHUCTT           nchar(10)             null,
   NGAYTHANHTOAN2       datetime             null,
   constraint PK_PHIEUTHANHTOAN primary key (MAPHIEU)
)
go

/*==============================================================*/
/* Index: LAPPHIEU_FK                                           */
/*==============================================================*/




create nonclustered index LAPPHIEU_FK on PHIEUTHANHTOAN (MAVC ASC)
go

/*==============================================================*/
/* Index: THANHTOAN_FK                                          */
/*==============================================================*/




create nonclustered index THANHTOAN_FK on PHIEUTHANHTOAN (MAHV2 ASC)
go

/*==============================================================*/
/* Table: PHONG_BAN                                             */
/*==============================================================*/
create table PHONG_BAN (
   MA_PHONG_BAN         nvarchar(10)          not null,
   TEN_PHONG_BAN        nvarchar(10)          null,
   SDT                  nvarchar(10)          null,
   constraint PK_PHONG_BAN primary key (MA_PHONG_BAN)
)
go

/*==============================================================*/
/* Table: THUOC                                                 */
/*==============================================================*/
create table THUOC (
   MA_PHONG_BAN         nvarchar(10)          not null,
   MAVC                 nvarchar(10)          not null,
   NGAYBDAULAM          datetime             null,
   NGAYKTHUCLAM         datetime             null,
   constraint PK_THUOC primary key (MA_PHONG_BAN, MAVC)
)
go

/*==============================================================*/
/* Index: THUOC_FK                                              */
/*==============================================================*/




create nonclustered index THUOC_FK on THUOC (MA_PHONG_BAN ASC)
go

/*==============================================================*/
/* Index: THUOC2_FK                                             */
/*==============================================================*/




create nonclustered index THUOC2_FK on THUOC (MAVC ASC)
go

/*==============================================================*/
/* Table: TRINHDO                                               */
/*==============================================================*/
create table TRINHDO (
   MATD                 nvarchar(10)          not null,
   TENTD                nvarchar(10)          null,
   constraint PK_TRINHDO primary key (MATD)
)
go

/*==============================================================*/
/* Table: TRINHDOCM                                             */
/*==============================================================*/
create table TRINHDOCM (
   MATDCM               nvarchar(10)          not null,
   TENTDCM              nvarchar(20)          null,
   CAPBAC               nvarchar(5)           null,
   constraint PK_TRINHDOCM primary key (MATDCM)
)
go

/*==============================================================*/
/* Table: VIENCHUC                                              */
/*==============================================================*/
create table VIENCHUC (
   MAVC                 nvarchar(10)          not null,
   TENVC                nvarchar(50)          null,
   NGAYSINH             datetime             null,
   GIOITINH             nvarchar(10)          null,
   SDT                  nvarchar(10)          null,
   DIACHI               nvarchar(50)          null,
   MATKHAUVC            nvarchar(30)          null,
   constraint PK_VIENCHUC primary key (MAVC)
)
go

alter table COTRINHDO
   add constraint FK_COTRINHD_COTRINHDO_CHUYENMO foreign key (MACM)
      references CHUYENMON (MACM)
go

alter table COTRINHDO
   add constraint FK_COTRINHD_COTRINHDO_TRINHDOC foreign key (MATDCM)
      references TRINHDOCM (MATDCM)
go

alter table COTRINHDO
   add constraint FK_COTRINHD_COTRINHDO_VIENCHUC foreign key (MAVC)
      references VIENCHUC (MAVC)
go

alter table DANGKY
   add constraint FK_DANGKY_DANGKY_DANHMUCN foreign key (MADANHMUC)
      references DANHMUCNN (MADANHMUC)
go

alter table DANGKY
   add constraint FK_DANGKY_DANGKY2_TRINHDO foreign key (MATD)
      references TRINHDO (MATD)
go

alter table DANGKY
   add constraint FK_DANGKY_DANGKY3_HOCVIEN foreign key (MAHV2)
      references HOCVIEN (MAHV2)
go

alter table GIANGDAY
   add constraint FK_GIANGDAY_GIANGDAY_LOPHOC foreign key (MALOP)
      references LOPHOC (MALOP)
go

alter table GIANGDAY
   add constraint FK_GIANGDAY_GIANGDAY2_VIENCHUC foreign key (MAVC)
      references VIENCHUC (MAVC)
go

alter table GIU
   add constraint FK_GIU_GIU_CHUCVU foreign key (MACV)
      references CHUCVU (MACV)
go

alter table GIU
   add constraint FK_GIU_GIU2_VIENCHUC foreign key (MAVC)
      references VIENCHUC (MAVC)
go

alter table GOM
   add constraint FK_GOM_GOM_KHOAHOC foreign key (MAKH)
      references KHOAHOC (MAKH)
go

alter table GOM
   add constraint FK_GOM_GOM2_DANHMUCN foreign key (MADANHMUC)
      references DANHMUCNN (MADANHMUC)
go

alter table HOCVIEN
   add constraint FK_HOCVIEN_CO_LOPHOC foreign key (MALOP)
      references LOPHOC (MALOP)
go

alter table PHIEUTHANHTOAN
   add constraint FK_PHIEUTHA_LAPPHIEU_VIENCHUC foreign key (MAVC)
      references VIENCHUC (MAVC)
go

alter table PHIEUTHANHTOAN
   add constraint FK_PHIEUTHA_THANHTOAN_HOCVIEN foreign key (MAHV2)
      references HOCVIEN (MAHV2)
go

alter table THUOC
   add constraint FK_THUOC_THUOC_PHONG_BA foreign key (MA_PHONG_BAN)
      references PHONG_BAN (MA_PHONG_BAN)
go

alter table THUOC
   add constraint FK_THUOC_THUOC2_VIENCHUC foreign key (MAVC)
      references VIENCHUC (MAVC)
go

