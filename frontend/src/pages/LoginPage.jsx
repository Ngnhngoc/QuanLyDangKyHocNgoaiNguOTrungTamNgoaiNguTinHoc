import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../services/api';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const clearLoginData = () => {
    sessionStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_role');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('gv_user');
    sessionStorage.removeItem('admin_user');
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showToast('Vui lòng nhập đầy đủ tài khoản và mật khẩu!', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl('/Auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ maSo: username.trim(), matKhau: password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        showToast(data.message || 'Tên đăng nhập hoặc mật khẩu không đúng!', 'error');
        return;
      }

      const role = (data.role || data.vaiTro || data.user?.vaiTro || '').toLowerCase();
      const user = data.user || {};

      clearLoginData();

      sessionStorage.setItem('auth_user', JSON.stringify(user));
      sessionStorage.setItem('auth_role', role);

      if (data.token) {
        sessionStorage.setItem('token', data.token);
      }

      if (role === 'admin' || role === 'nhanvien' || role === 'nhân viên') {
        sessionStorage.setItem('admin_user', JSON.stringify(user));
        showToast(data.message || 'Đăng nhập quản trị thành công!', 'success');

        setTimeout(() => {
          navigate('/admin');
          window.location.reload();
        }, 3000);

        return;
      }

      if (role === 'giangvien' || role === 'giảng viên') {
        sessionStorage.setItem('gv_user', JSON.stringify(user));
        showToast(data.message || 'Đăng nhập giảng viên thành công!', 'success');

        setTimeout(() => {
          navigate('/giang-vien/dashboard');
          window.location.reload();
        }, 3000);

        return;
      }

      sessionStorage.setItem('user', JSON.stringify(user));
      showToast(data.message || 'Đăng nhập học viên thành công!', 'success');

      setTimeout(() => {
        navigate('/');
        window.location.reload();
      }, 3000);
    } catch (error) {
      showToast('Không kết nối được với máy chủ!', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell d-flex align-items-center py-5">
      {toast && (
        <div className={`custom-toast custom-toast-${toast.type}`}>
          <div className="custom-toast-icon">
            {toast.type === 'success' ? '✓' : toast.type === 'warning' ? '!' : '×'}
          </div>

          <div>
            <div className="custom-toast-title">
              {toast.type === 'success'
                ? 'Thành công'
                : toast.type === 'warning'
                ? 'Thông báo'
                : 'Lỗi'}
            </div>

            <div className="custom-toast-message">
              {toast.message}
            </div>
          </div>
        </div>
      )}

      <div className="container">
        <div className="row align-items-center justify-content-center g-4">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="login-info-panel d-flex flex-column justify-content-between">
              <div>
                <Link
                  to="/"
                  className="text-white text-decoration-none d-inline-flex align-items-center gap-2 mb-5"
                >
                  <span className="brand-mark">🌐</span>
                  <span className="fs-3 fw-bold">LanguageForLife</span>
                </Link>

                <span className="hero-badge mb-4">
                  Cổng đăng nhập hệ thống
                </span>

                <h1 className="display-5 fw-bold mb-4">
                  Đăng nhập để sử dụng hệ thống quản lý đào tạo
                </h1>

                <p className="lead text-white-50">
                  Sau khi đăng nhập, hệ thống sẽ tự kiểm tra tài khoản và chuyển đến
                  giao diện phù hợp với từng người dùng.
                </p>
              </div>

              <div className="row g-3 mt-4">
                <div className="col-6">
                  <div className="login-role-card">
                    <div className="login-role-title">Học viên</div>
                    <div className="login-role-desc">
                      Đăng ký học, xem thời khóa biểu và học phí.
                    </div>
                  </div>
                </div>

                <div className="col-6">
                  <div className="login-role-card">
                    <div className="login-role-title">Giảng viên</div>
                    <div className="login-role-desc">
                      Theo dõi lớp học và danh sách học viên được phân công.
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="login-role-card">
                    <div className="login-role-title">Quản trị viên</div>
                    <div className="login-role-desc">
                      Quản lý khóa học, lớp học, ghi danh, học phí và báo cáo.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-lg-5">
            <div className="card login-card border-0">
              <div className="card-body p-0">
                <div className="text-center mb-4">
                  <div className="brand-mark mx-auto mb-3">🔐</div>

                  <h2 className="fw-bold mb-2">
                    Đăng nhập
                  </h2>

                  <p className="text-secondary mb-0">
                    Nhập tài khoản và mật khẩu được cấp để truy cập hệ thống.
                  </p>
                </div>

                <form onSubmit={handleLogin}>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">
                      Tài khoản
                    </label>

                    <input
                      type="text"
                      className="form-control px-4"
                      placeholder="Ví dụ: HV001, GV001, admin"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 text-start">
                    <label className="form-label fw-semibold">
                      Mật khẩu
                    </label>

                    <input
                      type="password"
                      className="form-control px-4"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold text-white"
                    disabled={loading}
                  >
                    {loading ? 'Đang kiểm tra...' : 'Đăng nhập'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <span className="text-secondary">
                    Cần cập nhật tài khoản?{' '}
                  </span>

                  <Link to="/doi-mat-khau" className="fw-bold text-decoration-none">
                    Đổi mật khẩu
                  </Link>
                </div>

                
              </div>
            </div>

            <div className="text-center mt-3">
              <Link to="/" className="text-secondary text-decoration-none">
                ← Quay về trang chủ
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}