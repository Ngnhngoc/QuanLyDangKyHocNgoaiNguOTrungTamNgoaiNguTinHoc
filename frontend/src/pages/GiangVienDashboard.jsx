import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from '../services/api';

export default function GiangVienDashboard() {
  const navigate = useNavigate();

  const [giangVien, setGiangVien] = useState(null);
  const [lopHoc, setLopHoc] = useState([]);
  const [hocVien, setHocVien] = useState([]);
  const [selectedLop, setSelectedLop] = useState('all');
  const [loading, setLoading] = useState(true);

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });

  const [displayDate, setDisplayDate] = useState(() => {
    const today = new Date();

    return today.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  });

  const hiddenDateRef = useRef(null);

  const layMaGiangVien = (gv) => {
    return (
      gv?.magv ||
      gv?.maGV ||
      gv?.maGv ||
      gv?.maGiangVien ||
      gv?.id ||
      ''
    );
  };

  useEffect(() => {
    const stored =
      sessionStorage.getItem('gv_user') ||
      (sessionStorage.getItem('auth_role') === 'giangvien'
        ? sessionStorage.getItem('auth_user')
        : null);

    if (!stored) {
      alert('Vui lòng đăng nhập tài khoản giảng viên.');
      navigate('/login');
      return;
    }

    const gv = JSON.parse(stored);
    const maGv = layMaGiangVien(gv);

    if (!maGv) {
      alert('Không tìm thấy mã giảng viên. Vui lòng đăng nhập lại.');
      navigate('/login');
      return;
    }

    setGiangVien({
      ...gv,
      magv: maGv,
    });

    const fetchData = async () => {
      setLoading(true);

      try {
        const [lopRes, hvRes] = await Promise.all([
          fetch(apiUrl(`/GiangVien/${maGv}/lop-duoc-phan-cong`)),
          fetch(apiUrl(`/GiangVien/${maGv}/hoc-vien`)),
        ]);

        if (lopRes.ok) {
          const data = await lopRes.json();
          setLopHoc(Array.isArray(data) ? data : []);
        }

        if (hvRes.ok) {
          const data = await hvRes.json();
          setHocVien(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error(error);
        alert('Không tải được dữ liệu giảng viên.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const filteredHocVien = useMemo(() => {
    if (selectedLop === 'all') {
      return hocVien;
    }

    return hocVien.filter((hv) => hv.maLop === selectedLop);
  }, [hocVien, selectedLop]);

  const taoNgayLocal = (dateStr) => {
    if (!dateStr) return null;

    if (dateStr instanceof Date) {
      return new Date(
        dateStr.getFullYear(),
        dateStr.getMonth(),
        dateStr.getDate()
      );
    }

    const value = String(dateStr).trim();

    if (!value || value === 'Chưa xếp' || value === 'Đang cập nhật') {
      return null;
    }

    if (value.includes('T')) {
      const d = new Date(value);

      if (!Number.isNaN(d.getTime())) {
        return new Date(d.getFullYear(), d.getMonth(), d.getDate());
      }
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(year, month - 1, day);
    }

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) {
      const [day, month, year] = value.split('/').map(Number);
      return new Date(year, month - 1, day);
    }

    const d = new Date(value);

    if (!Number.isNaN(d.getTime())) {
      return new Date(d.getFullYear(), d.getMonth(), d.getDate());
    }

    return null;
  };

  const formatDate = (date) => {
    const d = taoNgayLocal(date);
    return d ? d.toLocaleDateString('vi-VN') : 'Đang cập nhật';
  };

  const formatDateInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const formatDateVN = (dateStr) => {
    const d = taoNgayLocal(dateStr);

    if (!d) {
      return '';
    }

    return d.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const getMondayOfWeek = (dateString) => {
    const date = taoNgayLocal(dateString) || new Date();
    const day = date.getDay();
    const diff = day === 0 ? -6 : 1 - day;

    const monday = new Date(date);
    monday.setDate(date.getDate() + diff);
    monday.setHours(0, 0, 0, 0);

    return monday;
  };

  const weekDays = useMemo(() => {
    const monday = getMondayOfWeek(selectedDate);

    return [
      { key: 'T2', label: 'Thứ 2', index: 0 },
      { key: 'T3', label: 'Thứ 3', index: 1 },
      { key: 'T4', label: 'Thứ 4', index: 2 },
      { key: 'T5', label: 'Thứ 5', index: 3 },
      { key: 'T6', label: 'Thứ 6', index: 4 },
      { key: 'T7', label: 'Thứ 7', index: 5 },
      { key: 'CN', label: 'Chủ Nhật', index: 6 },
    ].map((day) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + day.index);

      return {
        ...day,
        date,
        dateISO: formatDateInput(date),
        shortDate: date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      };
    });
  }, [selectedDate]);

  const parseDays = (value) => {
    if (!value || value === 'Chưa xếp') return [];

    const s = value
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    const days = [];

    if (s.includes('2') || s.includes('hai')) days.push('T2');
    if (s.includes('3') || s.includes('ba')) days.push('T3');
    if (s.includes('4') || s.includes('tu')) days.push('T4');
    if (s.includes('5') || s.includes('nam')) days.push('T5');
    if (s.includes('6') || s.includes('sau')) days.push('T6');
    if (s.includes('7') || s.includes('bay')) days.push('T7');
    if (s.includes('cn') || s.includes('nhat') || s.includes('chu nhat')) days.push('CN');

    return days;
  };

  const getNgayHoc = (lop) => {
    return (
      lop.buoiHoc ||
      lop.ngayHoc ||
      lop.ngayhoc ||
      lop.lichHoc ||
      lop.lichhoc ||
      ''
    );
  };

  const lopCoHocTrongThu = (lop, thuKey) => {
    return parseDays(getNgayHoc(lop)).includes(thuKey);
  };

  const getGioHoc = (lop) => {
    return (
      lop.gioHoc ||
      lop.giohoc ||
      lop.thoiGianHoc ||
      lop.thoigianhoc ||
      'Chưa cập nhật'
    );
  };

  const getNgayKhaiGiang = (lop) => {
    return (
      lop.ngayKhaiGiang ||
      lop.ngaykhaigiang ||
      lop.ngayBDHoc ||
      lop.ngaybdhoc ||
      lop.ngayBatDau ||
      lop.ngaybatdau ||
      lop.ngayBatDauHoc ||
      lop.ngayMoLop ||
      lop.ngaymolop ||
      null
    );
  };

  const layNgayBatDauLop = (lop) => {
    return taoNgayLocal(getNgayKhaiGiang(lop));
  };

  const lopDaBatDauTrongNgay = (lop, ngayTrongTuan) => {
    const ngayBatDau = layNgayBatDauLop(lop);

    if (!ngayBatDau) {
      return true;
    }

    const ngayDangXet = new Date(
      ngayTrongTuan.getFullYear(),
      ngayTrongTuan.getMonth(),
      ngayTrongTuan.getDate()
    );

    return ngayDangXet >= ngayBatDau;
  };

  const getDayKeyFromDate = (date) => {
    const day = date.getDay();

    switch (day) {
      case 1:
        return 'T2';
      case 2:
        return 'T3';
      case 3:
        return 'T4';
      case 4:
        return 'T5';
      case 5:
        return 'T6';
      case 6:
        return 'T7';
      default:
        return 'CN';
    }
  };

  const tinhSoBuoiDay = (lop, ngayDangXet) => {
    const ngayBatDau = layNgayBatDauLop(lop);

    if (!ngayBatDau) {
      return null;
    }

    const cacBuoiTrongTuan = parseDays(getNgayHoc(lop));

    if (cacBuoiTrongTuan.length === 0) {
      return null;
    }

    const start = new Date(
      ngayBatDau.getFullYear(),
      ngayBatDau.getMonth(),
      ngayBatDau.getDate()
    );

    const end = new Date(
      ngayDangXet.getFullYear(),
      ngayDangXet.getMonth(),
      ngayDangXet.getDate()
    );

    if (end < start) {
      return null;
    }

    let soBuoi = 0;
    const current = new Date(start);

    while (current <= end) {
      const key = getDayKeyFromDate(current);

      if (cacBuoiTrongTuan.includes(key)) {
        soBuoi += 1;
      }

      current.setDate(current.getDate() + 1);
    }

    return soBuoi > 0 ? soBuoi : null;
  };

  const lopHocHopLeTheoNgay = useMemo(() => {
    return lopHoc.filter((lop) => {
      const ngayBatDau = layNgayBatDauLop(lop);

      if (!ngayBatDau) {
        return true;
      }

      const ngayCuoiTuan = weekDays[6].date;

      return ngayCuoiTuan >= ngayBatDau;
    });
  }, [lopHoc, selectedDate, weekDays]);

  const timeSlots = useMemo(() => {
    const slots = lopHocHopLeTheoNgay
      .map((lop) => getGioHoc(lop))
      .filter((gio) => gio && gio !== 'Chưa cập nhật' && gio !== 'Chưa xếp');

    const uniqueSlots = [...new Set(slots)];

    if (uniqueSlots.length === 0) {
      return [];
    }

    return uniqueSlots.sort();
  }, [lopHocHopLeTheoNgay]);

  const handleChonNgay = (value) => {
    setSelectedDate(value);
    setDisplayDate(formatDateVN(value));
  };

  const handleNhapNgay = (value) => {
    setDisplayDate(value);

    const cleaned = value.trim();

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleaned)) {
      const [day, month, year] = cleaned.split('/').map(Number);
      const date = new Date(year, month - 1, day);

      if (
        !Number.isNaN(date.getTime()) &&
        date.getDate() === day &&
        date.getMonth() === month - 1 &&
        date.getFullYear() === year
      ) {
        setSelectedDate(formatDateInput(date));
      }
    }
  };

  const moHopChonNgay = () => {
    if (!hiddenDateRef.current) {
      return;
    }

    if (typeof hiddenDateRef.current.showPicker === 'function') {
      hiddenDateRef.current.showPicker();
    } else {
      hiddenDateRef.current.click();
    }
  };

  const handlePrintSchedule = () => {
    window.print();
  };

  return (
    <div className="bg-light min-vh-100 py-5 gv-dashboard-page">
      <div className="container">
        <div className="mb-4">
          <h2 className="fw-bold text-success mb-1">
            Bảng điều khiển giảng viên
          </h2>

          <p className="text-secondary mb-0">
            Xin chào,{' '}
            <strong>
              {giangVien?.tennv || giangVien?.tenGV || giangVien?.hoTen}
            </strong>{' '}
            ({giangVien?.magv})
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success"></div>
          </div>
        ) : (
          <>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="border rounded-4 p-3 bg-white shadow-sm">
                  <div className="text-secondary small">
                    Chuyên môn
                  </div>

                  <div className="fs-5 fw-bold">
                    {giangVien?.chuyenmon || giangVien?.chuyenMon || 'Chưa cập nhật'}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="border rounded-4 p-3 bg-white shadow-sm">
                  <div className="text-secondary small">
                    Số lớp phụ trách
                  </div>

                  <div className="fs-5 fw-bold text-success">
                    {lopHoc.length}
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="border rounded-4 p-3 bg-white shadow-sm">
                  <div className="text-secondary small">
                    Học viên đã duyệt
                  </div>

                  <div className="fs-5 fw-bold text-primary">
                    {hocVien.length}
                  </div>
                </div>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
                  <div>
                    <h4 className="fw-bold text-primary mb-1">
                      THỜI KHÓA BIỂU GIẢNG DẠY
                    </h4>

                    <p className="text-secondary mb-0">
                      Hiển thị lịch dạy theo tuần, chỉ hiện các lớp đã đến ngày khai giảng.
                    </p>
                  </div>

                  <div className="d-flex align-items-center gap-2 flex-wrap">
                    <span className="text-secondary small">
                      Chọn mốc thời gian:
                    </span>

                    <div className="input-group" style={{ width: 190 }}>
                      <input
                        type="text"
                        className="form-control"
                        value={displayDate}
                        placeholder="dd/mm/yyyy"
                        onChange={(e) => handleNhapNgay(e.target.value)}
                      />

                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={moHopChonNgay}
                      >
                        📅
                      </button>

                      <input
                        ref={hiddenDateRef}
                        type="date"
                        value={selectedDate}
                        onChange={(e) => handleChonNgay(e.target.value)}
                        style={{
                          position: 'absolute',
                          opacity: 0,
                          pointerEvents: 'none',
                          width: 0,
                          height: 0,
                        }}
                      />
                    </div>

                    <button
                      className="btn btn-primary fw-bold text-white"
                      onClick={handlePrintSchedule}
                    >
                      In lịch
                    </button>
                  </div>
                </div>

                {timeSlots.length === 0 ? (
                  <div className="alert alert-info text-center mb-0">
                    Tuần được chọn chưa có lịch giảng dạy. Lịch chỉ hiển thị từ ngày khai giảng của lớp.
                  </div>
                ) : (
                  <div className="table-responsive border rounded-3">
                    <table className="table table-bordered align-middle text-center mb-0 teacher-schedule-table">
                      <thead>
                        <tr>
                          <th style={{ width: 120 }}>
                            Tiết / Giờ
                          </th>

                          {weekDays.map((day) => (
                            <th key={day.key}>
                              <div className="fw-bold">
                                {day.label}
                              </div>

                              <div className="small text-secondary">
                                ({day.shortDate})
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody>
                        {timeSlots.map((slot) => (
                          <tr key={slot}>
                            <td className="fw-semibold bg-light">
                              {slot}
                            </td>

                            {weekDays.map((day) => {
                              const classesInDay = lopHocHopLeTheoNgay.filter((lop) => {
                                return (
                                  getGioHoc(lop) === slot &&
                                  lopCoHocTrongThu(lop, day.key) &&
                                  lopDaBatDauTrongNgay(lop, day.date)
                                );
                              });

                              return (
                                <td key={`${slot}-${day.key}`} style={{ minWidth: 210 }}>
                                  {classesInDay.length > 0 ? (
                                    classesInDay.map((lop, index) => {
                                      const soBuoi = tinhSoBuoiDay(lop, day.date);

                                      return (
                                        <div
                                          key={`${lop.maLop}-${day.key}-${index}`}
                                          className="teacher-schedule-item text-start"
                                        >
                                          <div className="fw-bold text-dark">
                                            {lop.tenKhoaHoc || lop.tenKH || 'Khóa học'}
                                          </div>

                                          <div className="small text-secondary">
                                            {lop.tenLop} - {lop.maLop}
                                          </div>


                                          <div className="small text-success fw-bold mt-1">
                                            {soBuoi ? `Buổi ${soBuoi}` : 'Buổi dạy đang cập nhật'}
                                          </div>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <span className="text-muted small">
                                      -
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 mb-4 overflow-hidden">
              <div className="card-header bg-success text-white fw-bold">
                Lớp được phân công
              </div>

              <div className="card-body table-responsive p-0">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã lớp</th>
                      <th>Tên lớp</th>
                      <th>Khóa học</th>
                      <th>Ngày khai giảng</th>
                      <th>Lịch học</th>
                      <th>Sĩ số</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lopHoc.map((lop) => (
                      <tr key={lop.maLop}>
                        <td className="fw-bold text-success">
                          {lop.maLop}
                        </td>

                        <td>
                          {lop.tenLop}
                        </td>

                        <td>
                          {lop.tenKhoaHoc || lop.tenKH}
                        </td>

                        <td>
                          {formatDate(getNgayKhaiGiang(lop))}
                        </td>

                        <td>
                          {getNgayHoc(lop) || '-'} {getGioHoc(lop)}
                        </td>

                        <td>
                          {lop.siSo || 0}/{lop.tongCho || lop.soLuong || 0}
                        </td>
                      </tr>
                    ))}

                    {lopHoc.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          Chưa có lớp được phân công.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
              <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center flex-wrap gap-2">
                <span className="fw-bold">
                  Danh sách học viên trong lớp
                </span>

                <select
                  className="form-select form-select-sm"
                  style={{ width: 260 }}
                  value={selectedLop}
                  onChange={(e) => setSelectedLop(e.target.value)}
                >
                  <option value="all">
                    Tất cả lớp
                  </option>

                  {lopHoc.map((lop) => (
                    <option key={lop.maLop} value={lop.maLop}>
                      {lop.maLop} - {lop.tenLop}
                    </option>
                  ))}
                </select>
              </div>

              <div className="card-body table-responsive p-0">
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Lớp</th>
                      <th>Mã HV</th>
                      <th>Họ tên</th>
                      <th>SĐT</th>
                      <th>Email</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredHocVien.map((hv, index) => (
                      <tr key={`${hv.maLop}-${hv.maHocVien}-${index}`}>
                        <td>
                          {hv.maLop}
                        </td>

                        <td className="fw-bold">
                          {hv.maHocVien}
                        </td>

                        <td>
                          {hv.tenHocVien}
                        </td>

                        <td>
                          {hv.sdt || '-'}
                        </td>

                        <td>
                          {hv.email || '-'}
                        </td>
                      </tr>
                    ))}

                    {filteredHocVien.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center text-muted py-4">
                          Chưa có học viên đã duyệt.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>

      <style>{`
        .teacher-schedule-table thead th {
          background: #0f172a;
          color: #ffffff;
          padding: 14px 10px;
        }

        .teacher-schedule-table td {
          height: 110px;
          vertical-align: middle;
        }

        .teacher-schedule-item {
          padding: 12px;
          border-radius: 12px;
          border-left: 4px solid #198754;
          background: #d1fae5;
          box-shadow: inset 0 0 0 1px rgba(25, 135, 84, 0.12);
          margin-bottom: 8px;
        }

        @media print {
          .navbar,
          .btn,
          .card:not(:has(.teacher-schedule-table)),
          footer {
            display: none !important;
          }

          .gv-dashboard-page {
            background: #ffffff !important;
            padding: 0 !important;
          }

          .teacher-schedule-table {
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}