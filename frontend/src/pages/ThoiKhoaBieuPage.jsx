import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiUrl } from '../services/api';

export default function ThoiKhoaBieuPage() {
  const [lichHoc, setLichHoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [thongBaoLoi, setThongBaoLoi] = useState('');

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
  const navigate = useNavigate();

  const getCurrentUser = () => {
    try {
      const user =
        JSON.parse(sessionStorage.getItem('user') || 'null') ||
        JSON.parse(sessionStorage.getItem('auth_user') || 'null');

      return user?.user ? user.user : user;
    } catch (error) {
      console.error('Lỗi đọc thông tin học viên:', error);
      return null;
    }
  };

  useEffect(() => {
    const user = getCurrentUser();

    const maHocVien =
      user?.mahv ||
      user?.maHV ||
      user?.maHocVien ||
      user?.maSo;

    if (!maHocVien) {
      alert('Vui lòng đăng nhập để xem lịch học!');
      navigate('/login');
      return;
    }

    const fetchLichHoc = async () => {
      setLoading(true);
      setThongBaoLoi('');

      try {
        const res = await fetch(apiUrl(`/DangKy/LichHocCuaToi/${maHocVien}`));

        if (!res.ok) {
          const text = await res.text();
          console.warn('Không tải được lịch học:', text);
          setLichHoc([]);
          setThongBaoLoi('Không tải được dữ liệu thời khóa biểu. Vui lòng kiểm tra lại API lịch học.');
          return;
        }

        const data = await res.json();
        setLichHoc(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Lỗi tải lịch học:', err);
        setLichHoc([]);
        setThongBaoLoi('Không kết nối được API thời khóa biểu.');
      } finally {
        setLoading(false);
      }
    };

    fetchLichHoc();
  }, [navigate]);

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

  const getWeekDays = (baseDateStr) => {
    const monday = getMondayOfWeek(baseDateStr);

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
        dateStr: date.toLocaleDateString('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      };
    });
  };

  const daysOfWeek = useMemo(() => {
    return getWeekDays(selectedDate);
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

  const getGioHoc = (lop) => {
    return (
      lop.gioHoc ||
      lop.giohoc ||
      lop.thoiGianHoc ||
      lop.thoigianhoc ||
      'Chưa xếp'
    );
  };

  const getPhongHoc = (lop) => {
    return (
      lop.phongHoc ||
      lop.phonghoc ||
      lop.phong ||
      lop.tenPhong ||
      lop.tenphong ||
      lop.diaDiem ||
      lop.diadiem ||
      lop.diaDiemHoc ||
      lop.diadiemhoc ||
      'Chờ xếp'
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

  const tinhSoBuoiHoc = (lop, ngayDangXet) => {
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

  const layThuTuGio = (gio) => {
    if (!gio) return 9999;

    const match = gio.toString().match(/(\d{1,2})[:hH](\d{2})?/);

    if (!match) return 9999;

    const hour = Number(match[1] || 0);
    const minute = Number(match[2] || 0);

    return hour * 60 + minute;
  };

  const lichHocDaSapXep = useMemo(() => {
    return [...lichHoc].sort((a, b) => {
      const ngayA = layNgayBatDauLop(a)?.getTime() || 0;
      const ngayB = layNgayBatDauLop(b)?.getTime() || 0;

      if (ngayA !== ngayB) {
        return ngayA - ngayB;
      }

      const gioA = layThuTuGio(getGioHoc(a));
      const gioB = layThuTuGio(getGioHoc(b));

      if (gioA !== gioB) {
        return gioA - gioB;
      }

      return String(a.tenLop || '').localeCompare(String(b.tenLop || ''), 'vi');
    });
  }, [lichHoc]);

  const lichHocHopLeTheoTuan = useMemo(() => {
    return lichHocDaSapXep.filter((lop) => {
      const ngayBatDau = layNgayBatDauLop(lop);

      if (!ngayBatDau) {
        return true;
      }

      const ngayCuoiTuan = daysOfWeek[6]?.date;

      return ngayCuoiTuan >= ngayBatDau;
    });
  }, [lichHocDaSapXep, daysOfWeek]);

  const timeSlots = useMemo(() => {
    const slots = lichHocHopLeTheoTuan
      .map((lop) => getGioHoc(lop))
      .filter((gio) => gio && gio !== 'Chưa xếp' && gio !== 'Chưa cập nhật');

    const uniqueSlots = [...new Set(slots)];

    return uniqueSlots.sort((a, b) => layThuTuGio(a) - layThuTuGio(b));
  }, [lichHocHopLeTheoTuan]);

  const lopCoHocTrongThu = (lop, thuKey) => {
    return parseDays(getNgayHoc(lop)).includes(thuKey);
  };

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

  const colors = ['#f8d7da', '#d1ecf1', '#d4edda', '#fff3cd', '#e2e3e5', '#cce5ff'];

  const lopChoXepLich = lichHocDaSapXep.filter((lop) => {
    return (
      getGioHoc(lop) === 'Chưa xếp' ||
      getNgayHoc(lop) === 'Chưa xếp' ||
      !getGioHoc(lop) ||
      !getNgayHoc(lop)
    );
  });

  return (
    <div className="bg-white min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="container-fluid px-lg-5 py-4">
        <div className="d-flex justify-content-between align-items-end border-bottom pb-3 mb-4 flex-wrap gap-3">
          <div>
            <h4 className="fw-bold mb-1" style={{ color: '#0056b3' }}>
              THỜI KHÓA BIỂU DẠNG TUẦN
            </h4>

            <p className="text-secondary mb-0 small">
              Hiển thị lịch học chi tiết các lớp đã được duyệt.
            </p>
          </div>

          <div className="d-flex align-items-center gap-3 bg-light p-2 rounded shadow-sm border flex-wrap">
            <span className="fw-medium text-secondary ms-2" style={{ fontSize: '0.9rem' }}>
              <i className="bi bi-calendar-week me-2"></i>
              Chọn mốc thời gian:
            </span>

            <div className="input-group input-group-sm" style={{ width: 190 }}>
              <input
                type="text"
                className="form-control border-primary"
                value={displayDate}
                placeholder="dd/mm/yyyy"
                onChange={(e) => handleNhapNgay(e.target.value)}
              />

              <button
                type="button"
                className="btn btn-outline-primary"
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

            <button className="btn btn-primary btn-sm px-3" onClick={() => window.print()}>
              <i className="bi bi-printer me-1"></i>
              In lịch
            </button>
          </div>
        </div>

        {thongBaoLoi && (
          <div className="alert alert-warning rounded-4 border-0 shadow-sm">
            {thongBaoLoi}
          </div>
        )}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : lichHoc.length === 0 ? (
          <div className="alert alert-warning text-center">
            Bạn chưa có lịch học nào.
          </div>
        ) : timeSlots.length === 0 ? (
          <div className="alert alert-info text-center">
            Tuần được chọn chưa có lịch học. Lịch chỉ hiển thị từ ngày khai giảng của lớp.
          </div>
        ) : (
          <div className="table-responsive shadow-sm border rounded">
            <table
              className="table table-bordered text-center align-middle mb-0"
              style={{ minWidth: '1000px', tableLayout: 'fixed' }}
            >
              <thead style={{ backgroundColor: '#f0f8ff', color: '#333' }}>
                <tr>
                  <th className="py-3 align-middle" style={{ width: '120px' }}>
                    Tiết / Giờ
                  </th>

                  {daysOfWeek.map((day) => (
                    <th key={day.key} className="py-2">
                      <div className="fw-bold">
                        {day.label}
                      </div>

                      <div className="text-secondary fw-normal small">
                        ({day.dateStr})
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {timeSlots.map((time, timeIndex) => (
                  <tr key={time}>
                    <td
                      className="fw-bold"
                      style={{
                        backgroundColor: '#f8f9fa',
                        color: '#495057',
                        fontSize: '0.9rem',
                      }}
                    >
                      {time}
                    </td>

                    {daysOfWeek.map((day) => {
                      const classesHere = lichHocHopLeTheoTuan.filter((lop) => {
                        return (
                          getGioHoc(lop) === time &&
                          lopCoHocTrongThu(lop, day.key) &&
                          lopDaBatDauTrongNgay(lop, day.date)
                        );
                      });

                      return (
                        <td key={`${time}-${day.key}`} className="p-1" style={{ verticalAlign: 'top', height: '120px' }}>
                          {classesHere.length > 0 ? (
                            classesHere.map((lop, index) => {
                              const colorIndex =
                                ((lop.maLop || lop.tenLop || 'A').charCodeAt(0) + timeIndex + index) %
                                colors.length;

                              const soBuoiHoc = tinhSoBuoiHoc(lop, day.date);

                              return (
                                <div
                                  key={`${lop.maLop || index}-${day.key}-${index}`}
                                  className="p-2 rounded text-start shadow-sm mb-1"
                                  style={{
                                    backgroundColor: colors[colorIndex],
                                    borderLeft: '4px solid #0056b3',
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  <div className="fw-bold text-dark mb-1">
                                    {lop.tenKhoaHoc || 'Khóa học'}
                                  </div>

                                  <div className="text-secondary mb-1" style={{ fontSize: '0.8rem' }}>
                                    {lop.tenLop || 'Lớp học'}
                                  </div>

                                  <div className="text-dark">
                                    <strong>Phòng:</strong> {getPhongHoc(lop)}
                                  </div>

                                  <div className="text-primary fw-semibold mt-1">
                                    {soBuoiHoc ? `Buổi ${soBuoiHoc}` : 'Buổi học đang cập nhật'}
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

        {lopChoXepLich.length > 0 && (
          <div className="mt-4 p-3 bg-light border rounded">
            <h6 className="fw-bold text-danger mb-3">
              <i className="bi bi-info-circle me-2"></i>
              Các lớp đang chờ xếp lịch cụ thể
            </h6>

            <div className="row">
              {lopChoXepLich.map((lop, idx) => (
                <div className="col-md-4 mb-2" key={`${lop.maLop || idx}-${idx}`}>
                  <div className="card border-warning shadow-sm">
                    <div className="card-body p-2">
                      <strong className="d-block">
                        {lop.tenKhoaHoc} ({lop.tenLop})
                      </strong>

                      <small className="text-muted">
                        Trạng thái: {lop.trangThai || 'Chưa xếp lịch'}
                      </small>
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