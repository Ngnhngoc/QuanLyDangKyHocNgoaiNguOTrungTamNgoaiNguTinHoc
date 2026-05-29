import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xóa session và cho về trang chủ
    localStorage.removeItem('admin_user'); 
    navigate('/login');
  };

  // ĐOẠN CODE BẢO VỆ NẰM Ở ĐÂY
  useEffect(() => {
    // Kểm tra xem trong máy có vé admin_user chưa
    const adminToken = localStorage.getItem('admin_user');
    if (!adminToken) {
      alert("⛔ Báo động: Bạn không có quyền truy cập trang Quản trị! Vui lòng đăng nhập tài khoản ADMIN.");
      navigate('/login'); // Đá thẳng cổ ra ngoài trang đăng nhập
    }
  }, [navigate]);

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      {/* SIDEBAR - THANH MENU BÊN TRÁI */}
      <div className="bg-dark text-white p-3 shadow" style={{ width: '280px', position: 'fixed', height: '100vh', overflowY: 'auto' }}>
        <h3 className="text-center fw-bold mb-4 mt-2 text-danger">
          Admin<span className="text-white">Panel</span>
        </h3>
        <hr className="bg-secondary" />
        
        <ul className="nav nav-pills flex-column mb-auto gap-1">
          <li className="nav-item">
            <NavLink to="/admin/ngon-ngu" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Danh mục Ngôn ngữ
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/khoa-hoc" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Quản lý Khóa học
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/giang-vien" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Hồ sơ Giảng viên
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/lop-hoc" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Quản lý Lớp học
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/hoc-vien" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Hồ sơ Học viên
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/duyet-ghi-danh" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Duyệt Ghi danh
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/danh-sach-lop" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Danh sách theo Lớp
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/hoc-phi" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Quản lý Học phí
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/doanh-thu" className={({isActive}) => `nav-link text-white ${isActive ? 'bg-danger' : ''}`}>
              Báo cáo Doanh thu
            </NavLink>
          </li>
        </ul>

        <hr className="bg-secondary mt-5" />
        <button onClick={handleLogout} className="btn btn-outline-light w-100 mt-2">
          Đăng xuất
        </button>
      </div>

      {/* MAIN CONTENT - KHÔNG GIAN BÊN PHẢI */}
      <div style={{ marginLeft: '280px', width: '100%', padding: '30px' }}>
        <div className="bg-white rounded-4 shadow-sm p-4 min-vh-100">
          {/* Component Outlet này sẽ tự động thay đổi nội dung tùy theo menu được bấm */}
          <Outlet /> 
        </div>
      </div>
    </div>
  );
}