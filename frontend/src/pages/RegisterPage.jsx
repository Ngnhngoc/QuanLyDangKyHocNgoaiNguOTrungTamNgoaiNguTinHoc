import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiUrl } from '../services/api';

export default function RegisterPage() {
  const navigate = useNavigate();

  const [lopHocs, setLopHocs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({
    mahv: '',
    hotenhv: '',
    matkhauhv: '',
    xacNhanMatKhau: '',
    malop: '',
    dienthoaihv: '',
    emailhv: '',
    gioitinhhv: '',
    diachinv: '',
  });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    fetch(apiUrl('/LopHoc'))
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setLopHocs(Array.isArray(data) ? data : []))
      .catch(() => setLopHocs([]));
  }, []);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.mahv.trim() || !form.hotenhv.trim() || !form.matkhauhv || !form.malop) {
      showToast('Vui lòng nhập mã học viên, họ tên, mật khẩu và chọn lớp.', 'warning');
      return;
    }

    if (form.matkhauhv !== form.xacNhanMatKhau) {
      showToast('Mật khẩu xác nhận không khớp.', 'error');
      return;
    }

    const payload = {
      mahv: form.mahv.trim().toUpperCase(),
      malop: form.malop,
      hotenhv: form.hotenhv.trim(),
      matkhauhv: form.matkhauhv,
      dienthoaihv: form.dienthoaihv.trim() || null,
      emailhv: form.emailhv.trim() || null,
      gioitinhhv: form.gioitinhhv || null,
      diachinv: form.diachinv.trim() || null,
      ngaysinhhv: null,
      ngayhoc: null,
      buoihoc: null,
    };

    setLoading(true);

    try {
      const res = await fetch(apiUrl('/Auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Đăng ký tài khoản thành công! Bạn sẽ được chuyển đến trang đăng nhập.', 'success');

        setTimeout(() => {
          navigate('/login');
        }, 3000);

        return;
      }

      const err = await res.json().catch(() => ({}));
      showToast(err.message || 'Đăng ký thất bại.', 'error');
    } catch (error) {
      showToast('Không kết nối được máy chủ.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isPasswordTyping = form.xacNhanMatKhau.length > 0;
  const isPasswordMatch = form.matkhauhv === form.xacNhanMatKhau;

  return (
    <div className="register-shell">
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
        <div className="register-card">
          <div className="row g-0">
            <div className="col-lg-5">
              <div className="register-visual">
                <Link
                  to="/"
                  className="register-brand text-decoration-none"
                >
                  <span className="brand-mark">🌐</span>
                  <span>LanguageForLife</span>
                </Link>

                <div className="register-visual-content">
                  <span className="register-badge">
                    Tài khoản học viên
                  </span>

                  <h1>
                    Bắt đầu học ngoại ngữ dễ dàng hơn
                  </h1>

                  <p>
                    Tạo tài khoản để đăng ký lớp học, xem thời khóa biểu và theo dõi
                    học phí trên hệ thống của trung tâm.
                  </p>
                </div>

                <div className="register-benefits">
                  <div className="register-benefit-item">
                    <span>01</span>
                    <div>
                      <h6>Chọn lớp học</h6>
                      <p>Tra cứu và đăng ký lớp phù hợp.</p>
                    </div>
                  </div>

                  <div className="register-benefit-item">
                    <span>02</span>
                    <div>
                      <h6>Theo dõi lịch học</h6>
                      <p>Xem thông tin lớp và thời khóa biểu.</p>
                    </div>
                  </div>

                  <div className="register-benefit-item">
                    <span>03</span>
                    <div>
                      <h6>Quản lý học phí</h6>
                      <p>Theo dõi trạng thái thanh toán rõ ràng.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="register-form-panel">
                <div className="register-form-heading">
                  <span className="section-kicker">
                    Đăng ký học viên
                  </span>

                  <h2>
                    Tạo tài khoản mới
                  </h2>

                  <p>
                    Vui lòng nhập thông tin bên dưới để tạo tài khoản học viên và đăng ký lớp học.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <label className="form-label">
                        Mã học viên <span className="text-danger">*</span>
                      </label>

                      <input
                        className="form-control"
                        value={form.mahv}
                        onChange={(e) => handleChange('mahv', e.target.value.toUpperCase())}
                        placeholder="Ví dụ: HV004"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Họ tên <span className="text-danger">*</span>
                      </label>

                      <input
                        className="form-control"
                        value={form.hotenhv}
                        onChange={(e) => handleChange('hotenhv', e.target.value)}
                        placeholder="Nhập họ tên học viên"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">
                        Lớp muốn đăng ký <span className="text-danger">*</span>
                      </label>

                      <select
                        className="form-select"
                        value={form.malop}
                        onChange={(e) => handleChange('malop', e.target.value)}
                      >
                        <option value="">-- Chọn lớp --</option>

                        {lopHocs.map((lop, index) => {
                          const maLop = lop.maLop || lop.malop || lop.maLopHoc || '';
                          const tenLop = lop.tenLop || lop.tenlop || lop.tenLopHoc || '';
                          const tenKH = lop.tenKH || lop.tenKh || lop.tenKhoaHoc || '';

                          return (
                            <option key={maLop || index} value={maLop}>
                              {maLop} {tenLop ? `- ${tenLop}` : ''} {tenKH ? `(${tenKH})` : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Mật khẩu <span className="text-danger">*</span>
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={form.matkhauhv}
                        onChange={(e) => handleChange('matkhauhv', e.target.value)}
                        placeholder="Nhập mật khẩu"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Xác nhận mật khẩu <span className="text-danger">*</span>
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        value={form.xacNhanMatKhau}
                        onChange={(e) => handleChange('xacNhanMatKhau', e.target.value)}
                        placeholder="Nhập lại mật khẩu"
                      />

                      {isPasswordTyping && !isPasswordMatch && (
                        <small className="text-danger fw-semibold">
                          Mật khẩu xác nhận chưa khớp.
                        </small>
                      )}

                      {isPasswordTyping && isPasswordMatch && (
                        <small className="text-success fw-semibold">
                          Mật khẩu đã khớp.
                        </small>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Số điện thoại
                      </label>

                      <input
                        className="form-control"
                        value={form.dienthoaihv}
                        onChange={(e) => handleChange('dienthoaihv', e.target.value)}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Email
                      </label>

                      <input
                        type="email"
                        className="form-control"
                        value={form.emailhv}
                        onChange={(e) => handleChange('emailhv', e.target.value)}
                        placeholder="Nhập email"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Giới tính
                      </label>

                      <select
                        className="form-select"
                        value={form.gioitinhhv}
                        onChange={(e) => handleChange('gioitinhhv', e.target.value)}
                      >
                        <option value="">-- Chọn giới tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">
                        Địa chỉ
                      </label>

                      <input
                        className="form-control"
                        value={form.diachinv}
                        onChange={(e) => handleChange('diachinv', e.target.value)}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>

                  <div className="register-note">
                    Sau khi tạo tài khoản thành công, học viên có thể đăng nhập để sử dụng
                    các chức năng như đăng ký học, xem thời khóa biểu và theo dõi học phí.
                  </div>

                  <button
                    type="submit"
                    className="register-submit-btn"
                    disabled={loading}
                  >
                    {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
                  </button>
                </form>

                <div className="register-login-link">
                  Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
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
      </div>
    </div>
  );
}