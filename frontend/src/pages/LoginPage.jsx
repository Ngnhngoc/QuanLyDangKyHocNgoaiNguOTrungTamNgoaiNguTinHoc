import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // Thêm state để biết đang chọn đăng nhập kiểu gì
  const [vaiTro, setVaiTro] = useState('hocvien'); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Tùy theo vai trò mà gọi API khác nhau
    const apiUrl = vaiTro === 'hocvien' 
        ? 'http://localhost:5052/api/Hocvien/login' 
        : 'http://localhost:5052/api/Nhanvien/login'; // Gọi API Admin vừa viết

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        
        // NẾU LÀ ADMIN
        if (vaiTro === 'admin') {
            localStorage.setItem('admin_user', JSON.stringify(data.user));
            alert(data.message);
            navigate('/admin'); // Đá thẳng vào trang Admin
            window.location.reload();
        } 
        // NẾU LÀ HỌC VIÊN
        else {
            localStorage.setItem('user', JSON.stringify(data.user));
            alert(data.message);
            navigate('/'); // Đá về trang chủ
            window.location.reload();
        }
      } else {
        const errorData = await response.json();
        alert("⛔ " + (errorData.message || "Tên đăng nhập hoặc mật khẩu không đúng!"));
      }
    } catch (error) {
      alert("Không kết nối được với máy chủ!");
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            <div className="card-body">
              <h2 className="text-center fw-bold mb-4">ĐĂNG NHẬP</h2>
              
              {/* CHỌN VAI TRÒ (Học viên hay Admin) */}
              <div className="d-flex justify-content-center gap-3 mb-4">
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" id="roleHocVien" 
                    checked={vaiTro === 'hocvien'} onChange={() => setVaiTro('hocvien')} />
                  <label className="form-check-label fw-bold text-primary" htmlFor="roleHocVien">Học viên</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="radio" name="role" id="roleAdmin" 
                    checked={vaiTro === 'admin'} onChange={() => setVaiTro('admin')} />
                  <label className="form-check-label fw-bold text-danger" htmlFor="roleAdmin">Quản trị viên</label>
                </div>
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tài khoản</label>
                  <input type="text" className="form-control rounded-pill" 
                    value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Mật khẩu</label>
                  <input type="password" className="form-control rounded-pill" 
                    value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className={`btn w-100 rounded-pill py-2 fw-bold text-white shadow-sm ${vaiTro === 'admin' ? 'btn-danger' : 'btn-primary'}`}>
                  {vaiTro === 'admin' ? 'VÀO QUẢN TRỊ' : 'ĐĂNG NHẬP NGAY'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}