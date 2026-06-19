import React, { useEffect, useState } from 'react';
import { apiUrl } from '../services/api';

export default function AdminDoanhThu() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/PhieuThanhToan/ThongKeDoanhThu'));
      if (!res.ok) throw new Error('Không tải được thống kê doanh thu');
      setData(await res.json());
    } catch (error) {
      console.error(error);
      alert('Không kết nối được API thống kê doanh thu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const formatVND = (amount) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);

  if (loading) {
    return <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>;
  }

  const maxRevenue = Math.max(...(data?.theoKhoaHoc || []).map((x) => Number(x.doanhThu || 0)), 1);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">📊 BÁO CÁO DOANH THU</h3>
          <p className="text-secondary mb-0">Thống kê doanh thu, công nợ và số lượng đăng ký theo dữ liệu phiếu thanh toán.</p>
        </div>
        <button className="btn btn-primary fw-bold" onClick={fetchData}>Tải lại</button>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-3"><div className="border rounded-3 p-3 bg-light"><div className="text-secondary small">Tổng doanh thu</div><div className="fs-4 fw-bold text-success">{formatVND(data?.tongDoanhThu)}</div></div></div>
        <div className="col-md-3"><div className="border rounded-3 p-3 bg-light"><div className="text-secondary small">Công nợ</div><div className="fs-4 fw-bold text-danger">{formatVND(data?.tongCongNo)}</div></div></div>
        <div className="col-md-3"><div className="border rounded-3 p-3 bg-light"><div className="text-secondary small">Tổng đăng ký</div><div className="fs-4 fw-bold text-primary">{data?.tongDangKy || 0}</div></div></div>
        <div className="col-md-3"><div className="border rounded-3 p-3 bg-light"><div className="text-secondary small">Đã thanh toán</div><div className="fs-4 fw-bold text-dark">{data?.tongDaThanhToan || 0}</div></div></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-dark text-white fw-bold">Doanh thu theo tháng</div>
            <div className="card-body table-responsive">
              <table className="table align-middle mb-0">
                <thead><tr><th>Tháng</th><th className="text-end">Doanh thu</th><th className="text-center">Số phiếu</th></tr></thead>
                <tbody>
                  {(data?.theoThang || []).map((item) => <tr key={item.thang}><td>{item.thang}</td><td className="text-end fw-bold text-success">{formatVND(item.doanhThu)}</td><td className="text-center">{item.soPhieu}</td></tr>)}
                  {(data?.theoThang || []).length === 0 && <tr><td colSpan="3" className="text-center text-muted py-4">Chưa có phiếu thanh toán.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-header bg-dark text-white fw-bold">Thống kê theo khóa học</div>
            <div className="card-body">
              {(data?.theoKhoaHoc || []).map((item) => {
                const percent = Math.round((Number(item.doanhThu || 0) / maxRevenue) * 100);
                return (
                  <div key={item.maKhoaHoc} className="mb-4">
                    <div className="d-flex justify-content-between flex-wrap gap-2">
                      <div><strong>{item.tenKhoaHoc}</strong> <span className="text-secondary">({item.maKhoaHoc})</span></div>
                      <div className="fw-bold text-success">{formatVND(item.doanhThu)}</div>
                    </div>
                    <div className="progress my-2" style={{ height: 12 }}>
                      <div className="progress-bar bg-success" role="progressbar" style={{ width: `${percent}%` }} aria-valuenow={percent} aria-valuemin="0" aria-valuemax="100"></div>
                    </div>
                    <div className="small text-secondary">Đăng ký: {item.soDangKy} | Đã thanh toán: {item.daThanhToan} | Chưa thanh toán: {item.chuaThanhToan} | Công nợ: {formatVND(item.congNo)}</div>
                  </div>
                );
              })}
              {(data?.theoKhoaHoc || []).length === 0 && <div className="text-center text-muted py-4">Chưa có dữ liệu khóa học.</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
