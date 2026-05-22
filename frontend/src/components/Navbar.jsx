import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  
  // Lấy thông tin user từ localStorage
  const user = JSON.parse(localStorage.getItem('user')); 

  const handleLogout = () => {
    localStorage.removeItem('user'); // Xóa sạch dấu vết
    navigate('/'); // Đẩy về trang chủ
    window.location.reload(); // Reload nhẹ để Navbar cập nhật lại trạng thái
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4 sticky-top">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold text-success fs-3" to="/">
          🌍 Language<span className="text-danger">ForLife</span>
        </Link>

        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav fw-semibold fs-5 gap-4">
            <li className="nav-item"><Link className="nav-link" to="/">Giới thiệu</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/khoahoc">Khóa học</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/lich">Lịch khai giảng</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/giangvien">Giảng viên</Link></li>

            {/* CHỈ HIỆN KHI ĐÃ ĐĂNG NHẬP */}
            {user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-primary" to="/thoikhoabieu">🗓️ Lịch học</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-warning" to="/hocphi">💳 Học phí</Link>
                </li>
              </>
            )}
          </ul>
        </div>

        <div className="d-flex align-items-center gap-3">
          {user ? (
            // GIAO DIỆN KHI ĐÃ ĐĂNG NHẬP
            <div className="d-flex align-items-center gap-3">
              <span className="fw-bold text-secondary">Chào, {user.tenhv || 'Học viên'}!</span>
              <button onClick={handleLogout} className="btn btn-outline-danger rounded-pill px-4 fw-bold">
                ĐĂNG XUẤT
              </button>
            </div>
          ) : (
            // GIAO DIỆN KHI CHƯA ĐĂNG NHẬP
            <button onClick={() => navigate('/login')} className="btn btn-primary rounded-pill px-4 py-2 fw-bold shadow-sm">
              ĐĂNG NHẬP
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}