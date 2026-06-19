Bạn là lập trình viên full-stack ASP.NET Core + SQL Server + React. Hãy đọc toàn bộ project `QlyDkyHoc_System` và thực hiện tối ưu, sửa lỗi kết nối các luồng API lại với nhau.

Mục tiêu chính:
Sửa project để chạy được hoàn chỉnh theo luồng:

React Frontend → ASP.NET Core Web API → Entity Framework Core → SQL Server

Yêu cầu kiểm tra và sửa chi tiết:

1. Kiểm tra cấu trúc toàn bộ project

* Xác định thư mục backend chính là `QlyDkyHoc.API`.
* Xác định thư mục frontend chính là `frontend`.
* Nếu có thư mục client cũ hoặc file HTML cũ gọi API không còn tồn tại thì ghi chú rõ, không dùng làm frontend chính.
* Không xóa chức năng đang có nếu chưa chắc chắn.

2. Sửa kết nối SQL Server

* Kiểm tra `appsettings.json`, `Program.cs`, `QlyDkyHocContext.cs`.
* Đảm bảo `DefaultConnection` kết nối đúng SQL Server.
* Khi chạy local, cấu hình dùng được với SQL Server local.
* Khi chạy Docker Compose, cấu hình dùng được với service SQL Server trong `docker-compose.yml`.
* Thêm `TrustServerCertificate=True` nếu cần để tránh lỗi SSL SQL Server.
* Đảm bảo API không bị lỗi `Cannot open database QlyDkyHoc`.

3. Chuẩn hóa database schema

* Kiểm tra tất cả file SQL trong project như:

  * `CREATE_DATABASE.sql`
  * `QlyDkyHoc.sql`
  * `SQLQuery1.sql`
  * file `.bak` nếu có
* Chọn một schema chính phù hợp với code API hiện tại.
* Sửa file SQL chính để các bảng và cột khớp với Entity Framework model và Controller.
* Đặc biệt kiểm tra bảng `LOPHOC`, vì API đang dùng các cột:

  * `MALOP`
  * `MAKH`
  * `TENLOP`
  * `MAGV`
  * `SISO`
  * `SOLUONG`
  * `NGAYHOC`
  * `GIOHOC`
  * `NGAYBDHOC`
* Nếu SQL đang thiếu các cột này thì bổ sung.
* Kiểm tra các bảng:

  * `HOCVIEN`
  * `NHANVIEN`
  * `GIANGVIEN`
  * `DANHMUCNN`
  * `KHOAHOC`
  * `LOPHOC`
  * `DANGKY`
  * `PHIEUTHANHTOAN`
* Đảm bảo khóa chính, khóa ngoại, kiểu dữ liệu không gây lỗi khi gọi API.

4. Sửa Entity Framework Core

* Kiểm tra các model/entity trong backend.
* Đảm bảo tên bảng, tên cột map đúng với SQL Server.
* Nếu cần, sửa `OnModelCreating` trong `QlyDkyHocContext`.
* Không để model dùng tên cột khác với database.
* Đảm bảo các API CRUD chạy không lỗi do thiếu cột hoặc sai kiểu dữ liệu.

5. Kiểm tra và sửa toàn bộ Controller API

* Kiểm tra các controller:

  * `DanhMucNNController`
  * `KhoaHocController`
  * `LopHocController`
  * `GiangVienController`
  * `DangKyController`
  * `HocPhiController`
  * `HocvienController`
  * `NhanvienController`
* Đảm bảo route API thống nhất dạng:

  * `/api/DanhMucNN`
  * `/api/KhoaHoc`
  * `/api/LopHoc`
  * `/api/GiangVien`
  * `/api/DangKy`
  * `/api/HocPhi`
  * `/api/Hocvien/login`
  * `/api/Nhanvien/login`
* Sửa các API đang lỗi hoặc đang gọi dữ liệu không tồn tại.
* Nếu frontend đang gọi endpoint nào thì backend phải có endpoint đó.
* Nếu backend có endpoint nhưng frontend chưa dùng đúng thì sửa frontend.

6. Sửa API học phí

* Đảm bảo có API lấy học phí theo học viên.
* Đảm bảo có API tạo phiếu thanh toán.
* Đảm bảo API học phí lấy được thông tin:

  * mã học viên
  * họ tên học viên
  * lớp học
  * khóa học
  * học phí
  * trạng thái thanh toán
  * ngày thanh toán nếu có
* Nếu bảng `PHIEUTHANHTOAN` chưa đủ dữ liệu hoặc khóa ngoại thì sửa lại.
* Đảm bảo Swagger test được API học phí.

7. Sửa frontend React

* Kiểm tra toàn bộ file trong `frontend/src`.
* Tìm tất cả chỗ gọi `fetch` hoặc `axios`.
* Chuẩn hóa base API URL.
* Không hard-code lung tung nhiều port khác nhau.
* Nếu dùng Create React App thì lệnh chạy frontend là:
  `npm start`
  không phải:
  `npm run dev`
* Tạo file cấu hình API nếu cần, ví dụ:
  `src/config/api.js`
  hoặc `src/services/api.js`
* Đảm bảo frontend gọi đúng backend tại:
  `http://localhost:5052/api/...`
  hoặc dùng biến môi trường `.env`.
* Sửa các màn hình đang gọi sai API, đặc biệt:

  * đăng nhập học viên
  * đăng nhập nhân viên/admin
  * danh mục ngoại ngữ
  * khóa học
  * lớp học
  * đăng ký lớp
  * học phí
  * thanh toán
* Đảm bảo frontend hiển thị được dữ liệu thật từ SQL Server thông qua API.

8. Sửa Swagger

* Đảm bảo Swagger chạy tại:
  `http://localhost:5052/swagger`
* Đảm bảo tất cả API hiện ra trong Swagger.
* Đảm bảo các API GET/POST/PUT/DELETE test được.
* Nếu API cần dữ liệu mẫu thì thêm dữ liệu seed vào SQL.

9. Sửa Docker Compose nếu cần

* Kiểm tra `docker-compose.yml`.
* Đảm bảo có 3 service:

  * SQL Server
  * Backend API
  * Frontend
* Đảm bảo API chờ SQL Server sẵn sàng trước khi kết nối.
* Nếu chưa tự tạo database khi chạy Docker, hãy thêm cách chạy file SQL init hoặc hướng dẫn rõ cách import database.
* Kiểm tra port:

  * SQL Server: `1434:1433` hoặc cấu hình hợp lý
  * API: `5052`
  * Frontend: `3000`
* Đảm bảo connection string trong Docker dùng đúng tên service SQL, ví dụ:
  `Server=du-lieu-sql;Database=QlyDkyHoc;User Id=sa;Password=YourStrong@Password123;TrustServerCertificate=True`

10. Tạo dữ liệu mẫu

* Nếu database chưa có dữ liệu mẫu, hãy thêm file seed SQL.
* Dữ liệu mẫu cần đủ để test:

  * học viên
  * nhân viên
  * giảng viên
  * danh mục ngoại ngữ
  * khóa học
  * lớp học
  * đăng ký
  * phiếu thanh toán

11. Kiểm tra chạy thực tế
    Sau khi sửa, hãy đảm bảo chạy được các lệnh:

Backend:

```bash
cd QlyDkyHoc.API
dotnet restore
dotnet build
dotnet run
```

Frontend:

```bash
cd frontend
npm install
npm start
```

Docker:

```bash
docker compose up --build
```

12. Kết quả cần trả về
    Sau khi sửa xong, hãy báo cáo rõ:

* Đã sửa file nào.
* Lỗi ban đầu là gì.
* Đã sửa như thế nào.
* API nào đã test thành công.
* Swagger chạy ở đường dẫn nào.
* Frontend chạy ở đường dẫn nào.
* Database dùng file SQL nào là chính.
* Cách chạy project từng bước bằng VS Code.
* Nếu còn lỗi chưa sửa được thì nêu rõ nguyên nhân.

Lưu ý quan trọng:

* Không đổi tên project nếu không cần thiết.
* Không xóa controller hoặc chức năng cũ nếu chưa thay thế.
* Ưu tiên sửa để project chạy ổn định trước, sau đó mới tối ưu code.
* Tất cả route frontend và backend phải khớp nhau.
* SQL schema phải khớp với Entity Framework model.
* Mục tiêu cuối cùng là mở frontend, đăng nhập, xem danh sách khóa học/lớp học, đăng ký lớp, xem học phí và test API bằng Swagger được.
