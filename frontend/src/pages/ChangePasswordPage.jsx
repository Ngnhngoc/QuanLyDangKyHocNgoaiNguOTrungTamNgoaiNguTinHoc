import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../services/api';

export default function ChangePasswordPage() {
  const navigate = useNavigate();

  const [maSo, setMaSo] = useState('');
  const [matKhauCu, setMatKhauCu] = useState('');
  const [matKhauMoi, setMatKhauMoi] = useState('');
  const [xacNhanMatKhau, setXacNhanMatKhau] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    if (!maSo.trim() || !matKhauCu.trim() || !matKhauMoi.trim() || !xacNhanMatKhau.trim()) {
      setMessage('Vui lòng nhập đầy đủ thông tin.');
      setMessageType('warning');
      return;
    }

    if (matKhauMoi.trim().length < 6) {
      setMessage('Mật khẩu mới phải có ít nhất 6 ký tự.');
      setMessageType('warning');
      return;
    }

    if (matKhauMoi.trim() !== xacNhanMatKhau.trim()) {
      setMessage('Xác nhận mật khẩu mới không khớp.');
      setMessageType('warning');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(apiUrl('/Auth/doi-mat-khau'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          maSo: maSo.trim(),
          matKhauCu: matKhauCu.trim(),
          matKhauMoi: matKhauMoi.trim(),
          xacNhanMatKhau: xacNhanMatKhau.trim(),
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setMessage(data.message || 'Đổi mật khẩu thất bại.');
        setMessageType('danger');
        return;
      }

      setMessage(data.message || 'Đổi mật khẩu thành công. Vui lòng đăng nhập lại.');
      setMessageType('success');

      sessionStorage.removeItem('auth_user');
      sessionStorage.removeItem('auth_role');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      sessionStorage.removeItem('gv_user');
      sessionStorage.removeItem('admin_user');

      setMatKhauCu('');
      setMatKhauMoi('');
      setXacNhanMatKhau('');

      setTimeout(() => {
        navigate('/login');
        window.location.reload();
      }, 1800);
    } catch (error) {
      console.error('Lỗi đổi mật khẩu:', error);
      setMessage('Không kết nối được với máy chủ.');
      setMessageType('danger');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-shell d-flex align-items-center py-5">
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
                  Bảo mật tài khoản
                </span>

                <h1 className="display-5 fw-bold mb-4">
                  Đổi mật khẩu tài khoản hệ thống
                </h1>

                <p className="lead text-white-50">
                  Học viên, giảng viên, nhân viên và admin đều có thể đổi mật khẩu bằng mã tài khoản và mật khẩu cũ.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-7 col-lg-5">
            <div className="card login-card border-0">
              <div className="card-body p-0">
                <div className="text-center mb-4">
                  <div className="brand-mark mx-auto mb-3">🔑</div>

                  <h2 className="fw-bold mb-2">
                    Đổi mật khẩu
                  </h2>

                  <p className="text-secondary mb-0">
                    Nhập tài khoản, mật khẩu cũ và mật khẩu mới để cập nhật.
                  </p>
                </div>

                {message && (
                  <div className={`alert alert-${messageType} rounded-4`}>
                    {message}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">
                      Tài khoản
                    </label>

                    <input
                      type="text"
                      className="form-control px-4"
                      placeholder="Ví dụ: HV001, GV001, NV002, admin"
                      value={maSo}
                      onChange={(e) => setMaSo(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">
                      Mật khẩu cũ
                    </label>

                    <input
                      type="password"
                      className="form-control px-4"
                      placeholder="Nhập mật khẩu cũ"
                      value={matKhauCu}
                      onChange={(e) => setMatKhauCu(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3 text-start">
                    <label className="form-label fw-semibold">
                      Mật khẩu mới
                    </label>

                    <input
                      type="password"
                      className="form-control px-4"
                      placeholder="Nhập mật khẩu mới"
                      value={matKhauMoi}
                      onChange={(e) => setMatKhauMoi(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4 text-start">
                    <label className="form-label fw-semibold">
                      Xác nhận mật khẩu mới
                    </label>

                    <input
                      type="password"
                      className="form-control px-4"
                      placeholder="Nhập lại mật khẩu mới"
                      value={xacNhanMatKhau}
                      onChange={(e) => setXacNhanMatKhau(e.target.value)}
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-3 fw-bold text-white"
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                </form>

                <div className="text-center mt-4">
                  <Link to="/login" className="fw-bold text-decoration-none">
                    Quay lại đăng nhập
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
