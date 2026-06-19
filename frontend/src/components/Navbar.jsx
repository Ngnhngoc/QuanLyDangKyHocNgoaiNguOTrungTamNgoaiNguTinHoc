import React from 'react';
import { useNavigate, Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const safeParse = (key) => {
    try {
      return JSON.parse(sessionStorage.getItem(key) || 'null');
    } catch {
      return null;
    }
  };

  const authUser = safeParse('auth_user');
  const authRoleRaw = sessionStorage.getItem('auth_role') || '';

  const normalizeRole = (role) => {
    return role
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const authRole = normalizeRole(authRoleRaw);

  const isHocVien = authRole === 'hocvien';
  const isGiangVien = authRole === 'giangvien';
  const isAdmin = authRole === 'admin' || authRole === 'nhanvien';

  const user = isHocVien ? authUser || safeParse('user') : null;
  const gvUser = isGiangVien ? authUser || safeParse('gv_user') : null;
  const adminUser = isAdmin ? authUser || safeParse('admin_user') : null;

  const isLoggedIn = user || gvUser || adminUser;

  const displayName =
    user?.hoTen ||
    user?.hotenhv ||
    user?.tenhv ||
    user?.mahv ||
    gvUser?.hoTen ||
    gvUser?.tennv ||
    gvUser?.magv ||
    adminUser?.hoTen ||
    adminUser?.tennv ||
    adminUser?.manv ||
    'Người dùng';

  const handleLogout = () => {
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('gv_user');
    sessionStorage.removeItem('admin_user');

    navigate('/');
    window.location.reload();
  };

  const linkClass = ({ isActive }) =>
    `nav-link fw-semibold rounded-pill px-3 ${
      isActive ? 'text-primary bg-primary bg-opacity-10' : 'text-dark'
    }`;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom py-3 sticky-top">
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 fw-bold flex-shrink-0"
          to="/"
        >
          <span
            className="d-inline-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
            style={{ width: 34, height: 34 }}
          >
            🌐
          </span>

          <span className="fs-4 text-dark">
            Language<span className="text-primary">ForLife</span>
          </span>
        </Link>

        <button
          className="navbar-toggler border-0 shadow-sm"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-lg-1 align-items-lg-center">
            {!isGiangVien && !isAdmin && (
              <>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/">
                    Giới thiệu
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={linkClass} to="/khoahoc">
                    Khóa học
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={linkClass} to="/lich">
                    Lịch khai giảng
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={linkClass} to="/giangvien">
                    Giảng viên
                  </NavLink>
                </li>
              </>
            )}

            {isHocVien && (
              <>
                <li className="nav-item">
                  <NavLink className={linkClass} to="/thoikhoabieu">
                    🗓️ Lịch học
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className={linkClass} to="/hocphi">
                    💳 Học phí
                  </NavLink>
                </li>
              </>
            )}

            {isGiangVien && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/giang-vien/dashboard">
                  📘 Lớp giảng dạy
                </NavLink>
              </li>
            )}

            {isAdmin && (
              <li className="nav-item">
                <NavLink className={linkClass} to="/admin">
                  ⚙️ Trang quản trị
                </NavLink>
              </li>
            )}
          </ul>

          <div
            className="d-flex align-items-center justify-content-lg-end gap-2 ms-lg-auto mt-3 mt-lg-0"
            style={{
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
            }}
          >
            {isLoggedIn ? (
              <>
                <span
                  className="badge rounded-pill text-bg-light border px-3 py-2 text-secondary"
                  style={{
                    maxWidth: 230,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Xin chào, <span className="text-primary">{displayName}</span>
                </span>

                <button
                  type="button"
                  onClick={() => navigate('/doi-mat-khau')}
                  className="btn btn-outline-primary btn-sm px-3 fw-bold"
                >
                  Đổi mật khẩu
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="btn btn-outline-danger btn-sm px-3 fw-bold"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn btn-primary btn-sm px-3 fw-bold text-white"
              >
                Đăng nhập
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}