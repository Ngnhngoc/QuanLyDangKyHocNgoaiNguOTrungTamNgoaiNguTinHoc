import React, { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AdminLayout() {
  const navigate = useNavigate();

  const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || 'null');
  const authRole = sessionStorage.getItem('auth_role');

  const handleLogout = () => {
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('gv_user');
    sessionStorage.removeItem('admin_user');

    navigate('/login');
  };

  useEffect(() => {
    const currentAdmin = sessionStorage.getItem('admin_user');
    const currentRole = sessionStorage.getItem('auth_role');

    if (!currentAdmin || (currentRole !== 'admin' && currentRole !== 'nhanvien')) {
      alert('⛔ Bạn không có quyền truy cập trang quản trị! Vui lòng đăng nhập tài khoản quản trị hoặc nhân viên.');
      navigate('/login');
    }
  }, [navigate]);

  const adminMenuItems = [
    { to: '/admin/ngon-ngu', icon: '🌐', label: 'Danh mục ngôn ngữ' },
    { to: '/admin/khoa-hoc', icon: '📚', label: 'Quản lý khóa học' },
    { to: '/admin/giang-vien', icon: '👨‍🏫', label: 'Hồ sơ giảng viên' },
    { to: '/admin/lop-hoc', icon: '🏫', label: 'Quản lý lớp học' },
    { to: '/admin/hoc-vien', icon: '👨‍🎓', label: 'Hồ sơ học viên' },
    { to: '/admin/nhan-vien', icon: '👥', label: 'Hồ sơ nhân viên' },
    { to: '/admin/duyet-ghi-danh', icon: '✅', label: 'Duyệt ghi danh' },
    { to: '/admin/hoc-phi', icon: '💳', label: 'Quản lý học phí' },
    { to: '/admin/doanh-thu', icon: '📊', label: 'Báo cáo doanh thu' },
  ];

  const nhanVienMenuItems = [
    { to: '/admin/hoc-phi', icon: '💳', label: 'Quản lý học phí' },
    { to: '/admin/doanh-thu', icon: '📊', label: 'Báo cáo doanh thu' },
  ];

  const menuItems = authRole === 'admin' ? adminMenuItems : nhanVienMenuItems;

  const tenNguoiDung =
    adminUser?.hoTen ||
    adminUser?.tennv ||
    adminUser?.maSo ||
    adminUser?.manv ||
    adminUser?.manv2 ||
    'Người dùng';

  const tenQuyen =
    authRole === 'admin'
      ? 'Quản trị hệ thống'
      : 'Kế toán trung tâm';

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-icon">
            🌐
          </div>

          <div>
            <div className="fw-bold fs-5">
              LanguageForLife
            </div>

            <div className="small text-white-50">
              Admin Workspace
            </div>
          </div>
        </div>

        <div
          className="small text-uppercase text-white-50 fw-bold px-2 mb-2"
          style={{ letterSpacing: '.08em' }}
        >
          Chức năng quản trị
        </div>

        <ul className="nav flex-column mb-auto">
          {menuItems.map((item) => (
            <li className="nav-item" key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span>
                  {item.icon}
                </span>

                <span>
                  {item.label}
                </span>
              </NavLink>
            </li>
          ))}
        </ul>

        <div
          className="mt-4 p-3 rounded-4"
          style={{
            background: 'rgba(255,255,255,.08)',
            border: '1px solid rgba(255,255,255,.12)',
          }}
        >
          <div className="small text-white-50">
            Đăng nhập với quyền
          </div>

          <div className="fw-bold">
            {tenQuyen}
          </div>

          <div className="small text-white-50 mt-1">
            {tenNguoiDung}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-outline-light w-100 mt-3 fw-bold"
        >
          Đăng xuất
        </button>
      </aside>

      <main className="admin-main">
        <div className="admin-topbar d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <div className="section-kicker mb-1">
              Bảng điều khiển
            </div>

            <h4 className="fw-bold mb-0">
              Quản lý đăng ký học ngoại ngữ
            </h4>
          </div>

          <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-outline-primary fw-bold"
              onClick={() => navigate('/')}
            >
              Xem trang chủ
            </button>

            <span className="badge rounded-pill text-bg-success px-3 py-2">
              Đang hoạt động
            </span>
          </div>
        </div>

        <section className="admin-content-card">
          <Outlet />
        </section>
      </main>
    </div>
  );
}