import React, { useState, useEffect } from 'react';
import { apiUrl } from '../services/api';

export default function AdminDuyetGhiDanh() {
  const [dsChoDuyet, setDsChoDuyet] = useState([]);
  const [loading, setLoading] = useState(true);

  const showMessage = (message, type = 'info') => {
    if (window.showToast) {
      window.showToast(message, type);
      return;
    }

    alert(message);
  };

  const showAlert = (message, type = 'info') => {
    if (window.appAlert) {
      window.appAlert(message, type);
      return;
    }

    alert(message);
  };

  const showConfirm = async (message, title = 'Xác nhận thao tác') => {
    if (window.appConfirm) {
      return await window.appConfirm({
        title,
        message,
        type: 'warning',
      });
    }

    return window.confirm(message);
  };

  const getNhanVienDangNhap = () => {
    const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || 'null');
    const authUser = JSON.parse(sessionStorage.getItem('auth_user') || 'null');

    return (
      adminUser?.manv2 ||
      adminUser?.manv ||
      adminUser?.maSo ||
      adminUser?.maNv ||
      authUser?.manv2 ||
      authUser?.manv ||
      authUser?.maSo ||
      authUser?.maNv ||
      'NV002'
    );
  };

  const fetchDanhSach = async () => {
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/DangKy/ChoDuyet'));

      if (res.ok) {
        const data = await res.json();
        setDsChoDuyet(Array.isArray(data) ? data : []);
      } else {
        showAlert('Không tải được danh sách ghi danh chờ duyệt.', 'error');
      }
    } catch (err) {
      console.error('Lỗi tải dữ liệu:', err);
      showAlert('Không kết nối được API duyệt ghi danh.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const taoPhieuThanhToanSauKhiDuyet = async (maHv, maLop) => {
    try {
      const res = await fetch(apiUrl('/PhieuThanhToan/TaoSauKhiDuyet'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mahv: maHv,
          malop: maLop,
          manv2: getNhanVienDangNhap(),
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showAlert(
          data.message || 'Duyệt ghi danh thành công nhưng chưa tạo được phiếu thanh toán.',
          'warning'
        );
        return false;
      }

      showMessage(
        data.message || 'Đã tạo phiếu thanh toán cho học viên.',
        'success'
      );

      return true;
    } catch (error) {
      console.error(error);
      showAlert(
        'Duyệt ghi danh thành công nhưng không kết nối được API tạo phiếu thanh toán.',
        'warning'
      );
      return false;
    }
  };

  const handleDuyet = async (maHv, maLop) => {
    const dongY = await showConfirm(
      `Xác nhận duyệt học viên [${maHv}] vào lớp [${maLop}]? Sau khi duyệt, hệ thống sẽ tạo phiếu thanh toán cho học viên.`,
      'Duyệt ghi danh'
    );

    if (!dongY) {
      return;
    }

    try {
      const res = await fetch(apiUrl(`/DangKy/Duyet/${maHv}/${maLop}`), {
        method: 'PUT',
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        await taoPhieuThanhToanSauKhiDuyet(maHv, maLop);

        showMessage(
          data.message || 'Duyệt ghi danh thành công.',
          'success'
        );

        fetchDanhSach();
      } else {
        showAlert(data.message || 'Lỗi khi duyệt ghi danh.', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi kết nối server khi duyệt ghi danh.', 'error');
    }
  };

  const handleTuChoi = async (maHv, maLop) => {
    const dongY = await showConfirm(
      `Bạn có chắc muốn từ chối và hủy đơn đăng ký của học viên [${maHv}] ở lớp [${maLop}] không?`,
      'Từ chối ghi danh'
    );

    if (!dongY) {
      return;
    }

    try {
      const res = await fetch(apiUrl(`/DangKy/TuChoi/${maHv}/${maLop}`), {
        method: 'DELETE',
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        showMessage(
          data.message || 'Đã hủy đơn đăng ký.',
          'success'
        );

        fetchDanhSach();
      } else {
        showAlert(data.message || 'Không thể từ chối đơn đăng ký này.', 'error');
      }
    } catch (err) {
      console.error(err);
      showAlert('Lỗi kết nối server khi từ chối ghi danh.', 'error');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            ✅ Duyệt hồ sơ ghi danh
          </h3>

          <p className="text-secondary mb-0">
            Duyệt đăng ký học của học viên. Sau khi duyệt thành công, hệ thống mới tạo phiếu thanh toán.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-primary fw-bold"
          onClick={fetchDanhSach}
        >
          Tải lại
        </button>
      </div>

      <div className="alert alert-info border-0 rounded-4 mb-4">
        <div className="fw-bold mb-1">
          Quy trình xử lý
        </div>

        <div>
          Học viên đăng ký lớp sẽ ở trạng thái <strong>chờ duyệt</strong>. Khi admin hoặc nhân viên bấm
          <strong> Duyệt</strong>, hệ thống sẽ chuyển đăng ký sang trạng thái đã duyệt và tự tạo phiếu thanh toán
          ở trạng thái <strong>Chưa thanh toán</strong>.
        </div>
      </div>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0 table-responsive">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
            </div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4 py-3">
                    Thời gian ĐK
                  </th>

                  <th className="py-3">
                    Học viên
                  </th>

                  <th className="py-3">
                    Liên hệ
                  </th>

                  <th className="py-3">
                    Đăng ký lớp
                  </th>

                  <th className="py-3 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody>
                {dsChoDuyet.map((item, index) => (
                  <tr key={`${item.maHv}-${item.maLop}-${index}`}>
                    <td className="ps-4 py-3 text-muted fw-semibold">
                      {item.ngayDangKy || '-'}
                    </td>

                    <td className="py-3">
                      <div className="fw-bold text-primary">
                        {item.maHv}
                      </div>

                      <div className="fw-semibold text-dark">
                        {item.tenHv}
                      </div>
                    </td>

                    <td className="py-3 fw-semibold">
                      {item.sdt || 'Chưa cập nhật'}
                    </td>

                    <td className="py-3">
                      <span className="badge bg-info text-dark p-2 border border-info">
                        {item.maLop} - {item.tenLop}
                      </span>
                    </td>

                    <td className="py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDuyet(item.maHv, item.maLop)}
                        className="btn btn-sm btn-success rounded-pill px-3 me-2 fw-bold shadow-sm"
                      >
                        ✓ Duyệt
                      </button>

                      <button
                        type="button"
                        onClick={() => handleTuChoi(item.maHv, item.maLop)}
                        className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold"
                      >
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}

                {dsChoDuyet.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted h5">
                      🎉 Tuyệt vời! Hiện không có đơn ghi danh nào đang chờ duyệt.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}