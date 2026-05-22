import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      // Gọi API Đăng nhập thật từ Backend (nhớ check port 5052 có đúng máy em không nhé)
      const response = await fetch('http://localhost:5052/api/Hocvien/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          username: username, 
          password: password 
        }),
      });

      // Nếu API trả về thành công (Code 200)
      if (response.ok) {
        const data = await response.json();
        
        // Lưu thông tin học viên thực tế từ SQL Server trả về vào localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        alert(data.message); // Hiển thị "Đăng nhập thành công!"
        navigate('/');
        window.location.reload(); 
      } else {
        // Nếu API trả về lỗi (Code 400, 401)
        const errorData = await response.json();
        alert(errorData.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến Backend Server! (Có thể do lỗi CORS hoặc API chưa chạy)");
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="card-body">
              <h2 className="text-center fw-bold mb-4">ĐĂNG NHẬP</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên đăng nhập (Mã HV)</label>
                  <input 
                    type="text" className="form-control rounded-pill" 
                    value={username} onChange={(e) => setUsername(e.target.value)} 
                    placeholder="VD: HV02" required
                  />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Mật khẩu</label>
                  <input 
                    type="password" className="form-control rounded-pill" 
                    value={password} onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Nhập mật khẩu..." required
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm">
                  ĐĂNG NHẬP NGAY
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}