import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ThoiKhoaBieuPage() {
  const [lichHoc, setLichHoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]); // Ngày đang chọn để tính Tuần
  const navigate = useNavigate();

  useEffect(() => {
    const userString = localStorage.getItem('user');
    if (!userString) {
      alert("Vui lòng đăng nhập để xem lịch học!");
      navigate('/login');
      return;
    }

    const user = JSON.parse(userString);

    fetch(`http://localhost:5052/api/DangKy/LichHocCuaToi/${user.mahv}`)
      .then(res => res.json())
      .then(data => {
        setLichHoc(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi tải lịch học:", err);
        setLoading(false);
      });
  }, [navigate]);

  // 🧠 THUẬT TOÁN TÍNH NGÀY TRONG TUẦN TỪ NGÀY ĐƯỢC CHỌN
  const getWeekDays = (baseDateStr) => {
    const date = new Date(baseDateStr);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Tìm ngày Thứ 2 của tuần đó
    const monday = new Date(date.setDate(diff));

    const dayKeys = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
    const dayLabels = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ Nhật'];
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      weekDays.push({
        key: dayKeys[i],
        label: dayLabels[i],
        dateStr: d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }) // Format dd/MM
      });
    }
    return weekDays;
  };

  const daysOfWeek = getWeekDays(selectedDate);

  // 🧠 THUẬT TOÁN BÓC TÁCH NGÀY HỌC (Đã nâng cấp để không bị trống ô)
  const parseDays = (str) => {
    if (!str || str === 'Chưa xếp') return [];
    const s = str.toLowerCase();
    const days = [];
    if (s.includes('2') || s.includes('hai')) days.push('T2');
    if (s.includes('3') || s.includes('ba')) days.push('T3');
    if (s.includes('4') || s.includes('tư') || s.includes('tu')) days.push('T4');
    if (s.includes('5') || s.includes('năm') || s.includes('nam')) days.push('T5');
    if (s.includes('6') || s.includes('sáu') || s.includes('sau')) days.push('T6');
    if (s.includes('7') || s.includes('bảy') || s.includes('bay')) days.push('T7');
    if (s.includes('cn') || s.includes('nhật') || s.includes('nhat') || s.includes('chủ')) days.push('CN');
    return days;
  };

  const timeSlots = [...new Set(lichHoc.map(lop => lop.gioHoc).filter(g => g && g !== 'Chưa xếp'))].sort();
  const colors = ['#f8d7da', '#d1ecf1', '#d4edda', '#fff3cd', '#e2e3e5', '#cce5ff'];

  return (
    <div className="bg-white min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="container-fluid px-lg-5 py-4">
        
        {/* Header & Bộ Lọc Tuần */}
        <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4 flex-wrap gap-3">
            <div>
                <h4 className="fw-bold mb-1" style={{ color: '#0056b3' }}>THỜI KHÓA BIỂU DẠNG TUẦN</h4>
                <p className="text-secondary mb-0 small">Hiển thị lịch học chi tiết các môn đã được duyệt</p>
            </div>
            
            {/* TÍNH NĂNG LỌC THEO NGÀY / TUẦN */}
            <div className="d-flex align-items-center gap-3 bg-light p-2 rounded shadow-sm border">
                <span className="fw-medium text-secondary ms-2" style={{ fontSize: '0.9rem' }}>
                    <i className="bi bi-calendar-week me-2"></i>Chọn mốc thời gian:
                </span>
                <input 
                    type="date" 
                    className="form-control form-control-sm border-primary" 
                    style={{ width: '150px' }}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
                <button className="btn btn-primary btn-sm px-3" onClick={() => window.print()}>
                    <i className="bi bi-printer me-1"></i> In lịch
                </button>
            </div>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
        ) : lichHoc.length === 0 ? (
          <div className="alert alert-warning text-center">Bạn chưa có lịch học nào.</div>
        ) : (
          <div className="table-responsive shadow-sm border rounded">
            <table className="table table-bordered text-center align-middle mb-0" style={{ minWidth: '1000px', tableLayout: 'fixed' }}>
              <thead style={{ backgroundColor: '#f0f8ff', color: '#333' }}>
                <tr>
                  <th className="py-3 align-middle" style={{ width: '120px' }}>Tiết / Giờ</th>
                  
                  {/* TIÊU ĐỀ CỘT CÓ NGÀY THÁNG ĐỘNG */}
                  {daysOfWeek.map(day => (
                    <th key={day.key} className="py-2">
                        <div className="fw-bold">{day.label}</div>
                        <div className="text-secondary fw-normal small">({day.dateStr})</div>
                    </th>
                  ))}
                  
                </tr>
              </thead>
              <tbody>
                {timeSlots.length === 0 ? (
                   <tr><td colSpan="8" className="py-5 text-muted">Các lớp của bạn chưa được phân bổ khung giờ cụ thể.</td></tr>
                ) : (
                  timeSlots.map((time, timeIndex) => (
                    <tr key={timeIndex}>
                      <td className="fw-bold" style={{ backgroundColor: '#f8f9fa', color: '#495057', fontSize: '0.9rem' }}>
                        {time}
                      </td>
                      
                      {daysOfWeek.map(day => {
                        const classesHere = lichHoc.filter(lop => 
                          lop.gioHoc === time && parseDays(lop.buoiHoc).includes(day.key)
                        );

                        return (
                          <td key={day.key} className="p-1" style={{ verticalAlign: 'top', height: '120px' }}>
                            {classesHere.map((lop, i) => {
                              const colorIndex = (lop.maLop.charCodeAt(lop.maLop.length - 1) + i) % colors.length;
                              return (
                                <div 
                                  key={i} 
                                  className="p-2 h-100 rounded text-start shadow-sm mb-1" 
                                  style={{ backgroundColor: colors[colorIndex], borderLeft: '4px solid #0056b3', fontSize: '0.85rem' }}
                                >
                                  <div className="fw-bold text-dark mb-1">{lop.tenKhoaHoc}</div>
                                  <div className="text-secondary mb-1" style={{ fontSize: '0.8rem' }}>({lop.tenLop})</div>
                                  <div className="text-dark"><strong>Phòng:</strong> {lop.phongHoc || 'Chờ Xếp'}</div>
                                  <div className="text-dark"><strong>Bắt đầu:</strong> {lop.ngayKhaiGiang}</div>
                                </div>
                              )
                            })}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* CẢNH BÁO LỚP CHƯA XẾP LỊCH */}
        {lichHoc.filter(lop => lop.gioHoc === 'Chưa xếp' || lop.buoiHoc === 'Chưa xếp').length > 0 && (
          <div className="mt-4 p-3 bg-light border rounded">
            <h6 className="fw-bold text-danger mb-3"><i className="bi bi-info-circle me-2"></i>Các lớp đang chờ xếp lịch cụ thể</h6>
            <div className="row">
              {lichHoc.filter(lop => lop.gioHoc === 'Chưa xếp' || lop.buoiHoc === 'Chưa xếp').map((lop, idx) => (
                <div className="col-md-4 mb-2" key={idx}>
                    <div className="card border-warning shadow-sm">
                        <div className="card-body p-2">
                            <strong className="d-block">{lop.tenKhoaHoc} ({lop.tenLop})</strong>
                            <small className="text-muted">Trạng thái: {lop.trangThai}</small>
                        </div>
                    </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}