# Hướng dẫn chạy hệ thống Quản lý đăng ký học ngoại ngữ

## 1. Các phần đã bổ sung trong bản này

Bản này đã bổ sung các phần còn thiếu để web đầy đủ hơn so với bản trước:

- Trang quản trị học viên: `/admin/hoc-vien`
- Trang quản trị nhân viên: `/admin/nhan-vien`
- Trang báo cáo doanh thu: `/admin/doanh-thu`
- Route danh sách theo lớp: `/admin/danh-sach-lop`
- Đăng nhập giảng viên trên trang `/login`
- Trang giảng viên xem lớp được phân công và danh sách học viên: `/giang-vien/dashboard`
- Trang đăng ký tài khoản học viên: `/dang-ky`
- API CRUD nhân viên trong `NhanvienController`
- API đăng nhập giảng viên và xem lớp/học viên theo giảng viên trong `GiangVienController`
- API thống kê doanh thu trong `HocPhiController`

## 2. Yêu cầu trước khi chạy

Cần cài Docker Desktop trên máy. Sau khi mở Docker Desktop, đợi Docker chạy ổn định rồi mới mở terminal trong thư mục dự án.

## 3. Cách chạy bằng Docker Compose

Mở terminal tại thư mục chứa file `docker-compose.yml`, sau đó chạy:

```bash
docker compose up --build
```

Lần đầu chạy sẽ lâu hơn vì Docker cần tải SQL Server, build API và cài package cho frontend.

Sau khi chạy xong, truy cập:

- Giao diện web: http://localhost:3000
- Swagger API: http://localhost:5052/swagger
- SQL Server trong Docker: localhost,1435

Thông tin SQL Server:

- User: `sa`
- Password: `YourStrong@Password123`
- Database: `QlyDkyHoc`

## 4. Tài khoản demo

Có thể dùng các tài khoản demo sau:

- Học viên: `HV001` / `123456`
- Giảng viên: `GV001` / `123456`
- Quản trị viên: `admin` / `123456`

## 5. Cách dừng hệ thống

Dừng container nhưng vẫn giữ dữ liệu:

```bash
docker compose down
```

Xóa luôn volume dữ liệu SQL Server để chạy lại database từ đầu:

```bash
docker compose down -v
```

Nếu dùng lệnh `docker compose down -v`, lần sau chạy lại hệ thống sẽ tự tạo lại database và dữ liệu mẫu từ file `CREATE_DATABASE.sql`.

## 6. Ghi chú

Nếu frontend không gọi được API, kiểm tra lại API đã chạy ở cổng `5052` chưa. Nếu SQL Server chưa sẵn sàng ngay lúc đầu, API sẽ tự thử kết nối lại trong vài chục giây.

## Ghi chú bản giao diện mới

Bản này đã được làm lại giao diện theo phong cách hiện đại hơn:
- Trang chủ có hero section, thẻ tính năng và danh mục ngôn ngữ dạng card.
- Navbar được làm lại dạng glass, có responsive menu.
- Trang đăng nhập dùng chung được thiết kế dạng split layout.
- Trang admin có sidebar mới, topbar và các card tổng quan.
- Bảng, form, nút bấm và card được đồng bộ bo góc, màu sắc và hiệu ứng hover.

Cách chạy không thay đổi:

```bash
docker compose down -v
docker compose up --build
```

Mở giao diện tại `http://localhost:3000` và Swagger tại `http://localhost:5052/swagger`.
