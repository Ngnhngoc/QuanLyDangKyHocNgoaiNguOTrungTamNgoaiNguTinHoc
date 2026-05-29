import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function HocPhiPage() {
  const [danhSachHocPhi, setDanhSachHocPhi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Vui lòng đăng nhập để xem thông tin học phí!");
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);

    // Gọi API lấy thông tin học phí
    fetch(`http://localhost:5052/api/DangKy/HocPhiCuaToi/${user.mahv}`)
      .then(res => res.json())
      .then(data => {
        setDanhSachHocPhi(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải học phí:", err);
        setLoading(false);
      });
  }, [navigate]);

  // Hàm format tiền tệ VNĐ
  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Tính tổng tiền chưa thanh toán
  const tongChuaThanhToan = danhSachHocPhi
    .filter(item => item.trangThai === 0 || item.trangThai === null)
    .reduce((sum, item) => sum + item.hocPhi, 0);

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="container py-5">
        
        <div className="mb-4">
          <h2 className="fw-bold mb-1" style={{ color: '#0056b3' }}>Thông tin học phí</h2>
          <p className="text-secondary">Tra cứu các khoản phí và hướng dẫn thanh toán</p>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : danhSachHocPhi.length === 0 ? (
          <div className="alert alert-info text-center shadow-sm border-0 rounded-4 py-4">
            <i className="bi bi-wallet2 fs-1 text-info d-block mb-2"></i>
            Bạn chưa đăng ký khóa học nào nên chưa có khoản học phí cần đóng.
          </div>
        ) : (
          <div className="row g-4">
            
            {/* CỘT TRÁI: BẢNG CHI TIẾT HỌC PHÍ */}
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-receipt me-2 text-primary"></i>Chi tiết các khoản phí</h5>
                </div>
                <div className="table-responsive">
                  <table className="table table-hover align-middle text-center mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa', color: '#555' }}>
                      <tr>
                        <th className="py-3 text-start ps-4">Khóa học / Lớp</th>
                        <th className="py-3">Học phí</th>
                        <th className="py-3">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {danhSachHocPhi.map((item, index) => (
                        <tr key={index}>
                          <td className="py-3 text-start ps-4">
                            <div className="fw-bold text-dark">{item.tenKhoaHoc}</div>
                            <div className="text-secondary small">Mã lớp: {item.maLop}</div>
                          </td>
                          <td className="py-3 fw-medium text-danger">
                            {formatVND(item.hocPhi)}
                          </td>
                          <td className="py-3">
                            {item.trangThai === 1 ? (
                              <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                                <i className="bi bi-check-circle-fill me-1"></i>Đã thanh toán
                              </span>
                            ) : (
                              <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
                                <i className="bi bi-exclamation-circle-fill me-1"></i>Chưa nộp
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI: TỔNG KẾT & HƯỚNG DẪN THANH TOÁN */}
            <div className="col-lg-4">
              {/* Box Tổng tiền */}
              <div className="card border-0 shadow-sm rounded-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #0056b3, #00d2ff)' }}>
                <div className="card-body p-4">
                  <h6 className="text-white-50 mb-2">Tổng nợ cần thanh toán</h6>
                  <h2 className="fw-bold mb-0">{formatVND(tongChuaThanhToan)}</h2>
                </div>
              </div>

              {/* Box Hướng dẫn chuyển khoản */}
              {tongChuaThanhToan > 0 && (
                <div className="card border-0 shadow-sm rounded-4">
                  <div className="card-header bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-dark"><i className="bi bi-bank me-2 text-success"></i>Hướng dẫn chuyển khoản</h5>
                  </div>
                  <div className="card-body p-4 bg-light">
                    <p className="small text-muted mb-3">Vui lòng chuyển khoản số tiền <strong>{formatVND(tongChuaThanhToan)}</strong> theo thông tin dưới đây. Kế toán sẽ duyệt trạng thái sau 5-10 phút.</p>
                    
                    <div className="mb-2">
                      <small className="text-secondary d-block">Ngân hàng:</small>
                      <strong className="text-dark">MB Bank (Ngân hàng Quân Đội)</strong>
                    </div>
                    <div className="mb-2">
                      <small className="text-secondary d-block">Số tài khoản:</small>
                      <strong className="text-primary fs-5">0123 456 789</strong>
                    </div>
                    <div className="mb-3">
                      <small className="text-secondary d-block">Chủ tài khoản:</small>
                      <strong className="text-dark">TRUNG TAM LANGUAGE FOR LIFE</strong>
                    </div>
                    <div className="mb-0 p-2 bg-white border border-warning rounded">
                      <small className="text-secondary d-block">Nội dung chuyển khoản:</small>
                      <strong className="text-danger">
                        {JSON.parse(localStorage.getItem('user'))?.mahv || 'MAHV'} THANH TOAN HOC PHI
                      </strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}