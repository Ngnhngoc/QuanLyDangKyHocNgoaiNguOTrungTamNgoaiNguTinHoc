import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiUrl } from '../services/api';

export default function HocPhiPage() {
  const [danhSachHocPhi, setDanhSachHocPhi] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getCurrentUser = () => {
    const user =
      JSON.parse(sessionStorage.getItem('user') || 'null') ||
      JSON.parse(sessionStorage.getItem('auth_user') || 'null');

    return user;
  };

  useEffect(() => {
    const user = getCurrentUser();

    const maHocVien =
      user?.mahv ||
      user?.maHV ||
      user?.maHocVien ||
      user?.maSo;

    if (!maHocVien) {
      alert('Vui lòng đăng nhập tài khoản học viên để xem thông tin học phí!');
      navigate('/login');
      return;
    }

    fetch(apiUrl(`/DangKy/HocPhiCuaToi/${maHocVien}`))
      .then((res) => res.json())
      .then((data) => {
        setDanhSachHocPhi(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Lỗi tải học phí:', err);
        setLoading(false);
      });
  }, [navigate]);

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const tongChuaThanhToan = danhSachHocPhi
    .filter((item) => !item.daThanhToan && item.trangThai !== 1)
    .reduce((sum, item) => sum + Number(item.hocPhi || 0), 0);

  const user = getCurrentUser();

  const maHocVien =
    user?.mahv ||
    user?.maHV ||
    user?.maHocVien ||
    user?.maSo ||
    'MAHV';

  const scrollToHuongDan = () => {
    const element = document.getElementById('huong-dan-thanh-toan');

    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="container py-5">
        <div className="mb-4">
          <h2 className="fw-bold mb-1" style={{ color: '#0056b3' }}>
            Thông tin học phí
          </h2>

          <p className="text-secondary mb-0">
            Tra cứu học phí, trạng thái thanh toán và thông tin chuyển khoản.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : danhSachHocPhi.length === 0 ? (
          <div className="alert alert-info text-center shadow-sm border-0 rounded-4 py-4">
            <div className="fs-1 mb-2">💳</div>
            Bạn chưa có đăng ký học hoặc phiếu thanh toán nào cần theo dõi.
          </div>
        ) : (
          <div className="row g-4">
            <div className="col-lg-8">
              <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div className="card-header bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold text-dark">
                    🧾 Chi tiết các khoản học phí
                  </h5>
                </div>

                <div className="table-responsive">
                  <table className="table table-hover align-middle text-center mb-0">
                    <thead style={{ backgroundColor: '#f8f9fa', color: '#555' }}>
                      <tr>
                        <th className="py-3 text-start ps-4">
                          Khóa học / Lớp
                        </th>

                        <th className="py-3">
                          Học phí
                        </th>

                        <th className="py-3">
                          Trạng thái
                        </th>

                        <th className="py-3">
                          Ghi chú thanh toán
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {danhSachHocPhi.map((item, index) => {
                        const daThanhToan = item.daThanhToan || item.trangThaiPhieu === 'DA_THANH_TOAN';
                        const trangThaiDangKyText = (item.trangThaiDangKy || '')
                          .toString()
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '')
                          .toLowerCase();
                        const daDuyet = trangThaiDangKyText.includes('da duyet');

                        return (
                          <tr key={index}>
                            <td className="py-3 text-start ps-4">
                              <div className="fw-bold text-dark">
                                {item.tenKhoaHoc}
                              </div>

                              <div className="text-secondary small">
                                {item.tenLop} - Mã lớp: {item.maLop}
                              </div>

                              <div className="text-muted small">
                                Ghi danh: {item.trangThaiDangKy}
                              </div>
                            </td>

                            <td className="py-3 fw-medium text-danger">
                              {formatVND(item.hocPhi)}
                            </td>

                            <td className="py-3">
                              {daThanhToan ? (
                                <>
                                  <span className="badge bg-success bg-opacity-10 text-success border border-success px-3 py-2 rounded-pill">
                                    Đã thanh toán
                                  </span>

                                  {item.ngayThanhToan && (
                                    <div className="small text-muted mt-2">
                                      {new Date(item.ngayThanhToan).toLocaleDateString('vi-VN')}
                                    </div>
                                  )}
                                </>
                              ) : (
                                <span className="badge bg-danger bg-opacity-10 text-danger border border-danger px-3 py-2 rounded-pill">
                                  Chưa thanh toán
                                </span>
                              )}
                            </td>

                            <td className="py-3">
                              {daThanhToan ? (
                                <div>
                                  <div className="text-success small fw-semibold">
                                    Đã được kế toán xác nhận
                                  </div>

                                  {item.maPhieu && (
                                    <div className="small text-muted">
                                      Mã phiếu: {item.maPhieu}
                                    </div>
                                  )}
                                </div>
                              ) : daDuyet ? (
                                <button
                                  type="button"
                                  className="btn btn-sm btn-primary rounded-pill fw-bold px-3"
                                  onClick={scrollToHuongDan}
                                >
                                  Xem hướng dẫn
                                </button>
                              ) : (
                                <span className="text-muted small">
                                  Chờ duyệt ghi danh
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="alert alert-warning border-0 rounded-4 mt-4 shadow-sm">
                <div className="fw-bold mb-1">
                  Lưu ý
                </div>

                <div>
                  Phiếu thanh toán chỉ xuất hiện sau khi đăng ký học được admin hoặc nhân viên duyệt.
                  Sau khi học viên chuyển khoản, kế toán trung tâm sẽ kiểm tra giao dịch và cập nhật trạng thái
                  <strong> Đã thanh toán</strong>.
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 mb-4 text-white" style={{ background: 'linear-gradient(135deg, #0056b3, #00d2ff)' }}>
                <div className="card-body p-4">
                  <h6 className="text-white-50 mb-2">
                    Tổng nợ cần thanh toán
                  </h6>

                  <h2 className="fw-bold mb-0">
                    {formatVND(tongChuaThanhToan)}
                  </h2>
                </div>
              </div>

              {tongChuaThanhToan > 0 && (
                <div className="card border-0 shadow-sm rounded-4" id="huong-dan-thanh-toan">
                  <div className="card-header bg-white border-bottom py-3">
                    <h5 className="mb-0 fw-bold text-dark">
                      🏦 Hướng dẫn chuyển khoản
                    </h5>
                  </div>

                  <div className="card-body p-4 bg-light">
                    <p className="small text-muted mb-3">
                      Vui lòng chuyển khoản đúng số tiền và đúng nội dung để kế toán
                      dễ dàng kiểm tra, đối chiếu.
                    </p>

                    <div className="mb-3">
                      <small className="text-secondary d-block">
                        Ngân hàng
                      </small>

                      <strong className="text-dark">
                        MB Bank - Ngân hàng Quân Đội
                      </strong>
                    </div>

                    <div className="mb-3">
                      <small className="text-secondary d-block">
                        Số tài khoản
                      </small>

                      <strong className="text-primary fs-5">
                        0123 456 789
                      </strong>
                    </div>

                    <div className="mb-3">
                      <small className="text-secondary d-block">
                        Chủ tài khoản
                      </small>

                      <strong className="text-dark">
                        TRUNG TAM LANGUAGE FOR LIFE
                      </strong>
                    </div>

                    <div className="mb-3">
                      <small className="text-secondary d-block">
                        Số tiền cần chuyển
                      </small>

                      <strong className="text-danger fs-5">
                        {formatVND(tongChuaThanhToan)}
                      </strong>
                    </div>

                    <div className="p-3 bg-white border border-warning rounded-4">
                      <small className="text-secondary d-block">
                        Nội dung chuyển khoản
                      </small>

                      <strong className="text-danger">
                        {maHocVien} THANH TOAN HOC PHI
                      </strong>
                    </div>

                    <div className="small text-muted mt-3">
                      Sau khi chuyển khoản, vui lòng chờ kế toán xác nhận. Học viên không cần tự tạo phiếu thanh toán.
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