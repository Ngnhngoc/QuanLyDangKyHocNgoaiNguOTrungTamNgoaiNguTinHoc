using Microsoft.EntityFrameworkCore;
using QlyDkyHoc.API.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Database (SQL Server)
builder.Services.AddDbContext<QlyDkyHocContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Kích hoạt Controller (Chỉ dùng AddControllers cho API để nhẹ máy)
builder.Services.AddControllers(); 

// 3. Công cụ Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 4. Cấu hình CORS - Giúp React (cổng 3000) gọi được API (cổng 8080/5000)
// Thêm đoạn này để cho phép React (cổng 3000) lấy dữ liệu
builder.Services.AddCors(options =>
{
    options.AddPolicy("ChoPhepReact", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Trỏ đúng vào nhà của React
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// --- CẤU HÌNH PIPELINE (Sửa lại thứ tự cho chuẩn) ---

app.UseSwagger();
app.UseSwaggerUI();

app.UseStaticFiles(); 
app.UseRouting();

// 🟢 CHỈ GIỮ LẠI MỘT DÒNG NÀY (Xóa dòng ChoPhepTatCa đi)
app.UseCors("ChoPhepReact"); 

app.UseAuthorization();

app.MapControllers();

app.Run();