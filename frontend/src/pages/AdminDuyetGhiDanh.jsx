import React, { useState, useEffect } from 'react';

export default function AdminDuyetGhiDanh() {
  const [dsChoDuyet, setDsChoDuyet] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDanhSach = async () => {
    try {
      const res = await fetch('http://localhost:5052/api/DangKy/ChoDuyet');
      if (res.ok) {
        setDsChoDuyet(await res.json());
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDanhSach();
  }, []);

  const handleDuyet = async (maHv, maLop) => {
    if (!window.confirm(`Xác nhận duyệt học viên [${maHv}] vào lớp [${maLop}]?`)) return;

    try {
      const res = await fetch(`http://localhost:5052/api/DangKy/Duyet/${maHv}/${maLop}`, { method: 'PUT' });
      const data = await res.json();
      
      if (res.ok) {
        alert("✅ " + data.message);
        fetchDanhSach(); // Tải lại bảng
      } else {
        alert("⛔ " + (data.message || "Lỗi khi duyệt!"));
      }
    } catch (err) {
      alert("Lỗi kết nối Server!");
    }
  };

  const handleTuChoi = async (maHv, maLop) => {
    if (!window.confirm(`Bạn có chắc muốn TỪ CHỐI và HỦY đơn đăng ký này?`)) return;

    try {
      const res = await fetch(`http://localhost:5052/api/DangKy/TuChoi/${maHv}/${maLop}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Đã hủy đơn đăng ký!");
        fetchDanhSach();
      }
    } catch (err) {
      alert("Lỗi kết nối Server!");
    }
  };

  return (
    <div className="container-fluid py-2">
      <h3 className="fw-bold text-dark mb-4 border-bottom pb-2">✅ DUYỆT HỒ SƠ GHI DANH</h3>

      <div className="card shadow-sm border-0 rounded-3">
        <div className="card-body p-0 table-responsive">
          {loading ? (
            <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
          ) : (
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th className="ps-4 py-3">Thời gian ĐK</th>
                  <th className="py-3">Học viên</th>
                  <th className="py-3">Liên hệ</th>
                  <th className="py-3">Đăng ký lớp</th>
                  <th className="py-3 text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {dsChoDuyet.map((item, index) => (
                  <tr key={index}>
                    <td className="ps-4 py-3 text-muted fw-semibold">{item.ngayDangKy}</td>
                    <td className="py-3">
                      <div className="fw-bold text-primary">{item.maHv}</div>
                      <div className="fw-semibold text-dark">{item.tenHv}</div>
                    </td>
                    <td className="py-3 fw-semibold">{item.sdt || 'Chưa cập nhật'}</td>
                    <td className="py-3">
                      <span className="badge bg-info text-dark p-2 border border-info">
                        {item.maLop} - {item.tenLop}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <button onClick={() => handleDuyet(item.maHv, item.maLop)} className="btn btn-sm btn-success rounded-pill px-3 me-2 fw-bold shadow-sm">
                        ✓ Duyệt
                      </button>
                      <button onClick={() => handleTuChoi(item.maHv, item.maLop)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">
                        Từ chối
                      </button>
                    </td>
                  </tr>
                ))}
                {dsChoDuyet.length === 0 && (
                  <tr><td colSpan="5" className="text-center py-5 text-muted h5">🎉 Tuyệt vời! Hiện không có đơn ghi danh nào đang chờ duyệt.</td></tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}