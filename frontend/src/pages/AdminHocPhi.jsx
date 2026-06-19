import React, { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../services/api';

export default function AdminHocPhi() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [status, setStatus] = useState('all');

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

  const fetchHocPhi = async () => {
    setLoading(true);

    try {
      const res = await fetch(apiUrl('/PhieuThanhToan'));

      if (!res.ok) {
        throw new Error('Không tải được danh sách phiếu thanh toán');
      }

      const data = await res.json();
      setRows(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      showAlert('Không kết nối được API phiếu thanh toán.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHocPhi();
  }, []);

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'HOCPHI_DA_LAP_PHIEU') {
        fetchHocPhi();
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

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

  const getTenNhanVienDangNhap = () => {
    const adminUser = JSON.parse(sessionStorage.getItem('admin_user') || 'null');
    const authUser = JSON.parse(sessionStorage.getItem('auth_user') || 'null');

    return (
      adminUser?.hoTen ||
      adminUser?.tennv ||
      adminUser?.tenNv ||
      authUser?.hoTen ||
      authUser?.tennv ||
      authUser?.tenNv ||
      getNhanVienDangNhap()
    );
  };

  const isDangKyDaDuyet = (item) => {
    const value = (item.trangThaiDangKy || item.trangthaiDangKy || '')
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();

    return (
      value.includes('da duyet') ||
      value.includes('duyet') ||
      value === '1' ||
      item.trangThai === 1 ||
      item.trangthai === 1
    );
  };

  const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return date ? new Date(date).toLocaleDateString('vi-VN') : '-';
  };

  const taoMaPhieuTam = () => {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const mi = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');

    return `PT${y}${m}${d}${h}${mi}${s}`;
  };

  const escapeHtml = (value) => {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  };

  const getTrangThaiPhieu = (item) => {
    if (item.trangThaiPhieu) {
      return item.trangThaiPhieu;
    }

    if (item.trangthaiPhieu) {
      return item.trangthaiPhieu;
    }

    if (item.trangThaiThanhToan) {
      const value = item.trangThaiThanhToan
        .toString()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toUpperCase();

      if (value.includes('DA THANH TOAN')) return 'DA_THANH_TOAN';
      if (value.includes('CHO XAC NHAN')) return 'CHO_XAC_NHAN';
      if (value.includes('HUY')) return 'HUY';
    }

    return item.daThanhToan ? 'DA_THANH_TOAN' : 'CHUA_THANH_TOAN';
  };

  const getTenTrangThaiPhieu = (value) => {
    switch (value) {
      case 'CHO_XAC_NHAN':
        return 'Chờ xác nhận';
      case 'DA_THANH_TOAN':
        return 'Đã thanh toán';
      case 'HUY':
        return 'Hủy phiếu';
      default:
        return 'Chưa thanh toán';
    }
  };

  const getSelectClass = (value) => {
    switch (value) {
      case 'DA_THANH_TOAN':
        return 'text-success';
      case 'CHO_XAC_NHAN':
        return 'text-warning';
      case 'HUY':
        return 'text-secondary';
      default:
        return 'text-danger';
    }
  };

  const handleDoiTrangThaiPhieu = async (
    item,
    trangThaiMoi,
    hinhThucThanhToanTuSua = null
  ) => {
    if (!isDangKyDaDuyet(item)) {
      showAlert('Chỉ cập nhật thanh toán khi học viên đã được duyệt ghi danh.', 'warning');
      return;
    }

    let hinhThucThanhToan =
      hinhThucThanhToanTuSua ||
      item.hinhThucThanhToan ||
      item.hinhthuctt ||
      'Chuyen khoan';

    if (trangThaiMoi === 'DA_THANH_TOAN' && !hinhThucThanhToanTuSua) {
      const value = window.prompt(
        'Nhập hình thức thanh toán:',
        hinhThucThanhToan
      );

      if (value === null) {
        return;
      }

      hinhThucThanhToan = value.trim() || 'Chuyen khoan';
    }

    try {
      const payload = {
        mahv: item.maHocVien,
        malop: item.maLop,
        manv2: getNhanVienDangNhap(),
        trangThai: trangThaiMoi,
        hinhthuctt: hinhThucThanhToan,
      };

      const res = await fetch(apiUrl('/PhieuThanhToan/DoiTrangThai'), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showAlert(data.message || 'Không cập nhật được trạng thái phiếu thanh toán.', 'error');
        return;
      }

      showMessage(data.message || 'Cập nhật trạng thái phiếu thanh toán thành công.', 'success');
      fetchHocPhi();
    } catch (error) {
      console.error(error);
      showAlert('Không kết nối được API đổi trạng thái phiếu thanh toán.', 'error');
    }
  };

  const handleSuaHinhThucThanhToan = async (item) => {
    if (!item.maPhieu) {
      showAlert('Chưa có phiếu thanh toán để sửa.', 'warning');
      return;
    }

    const value = window.prompt(
      'Sửa hình thức thanh toán:',
      item.hinhThucThanhToan || item.hinhthuctt || 'Chuyen khoan'
    );

    if (value === null) {
      return;
    }

    const hinhThucMoi = value.trim() || 'Chuyen khoan';

    await handleDoiTrangThaiPhieu(
      item,
      getTrangThaiPhieu(item),
      hinhThucMoi
    );
  };

  const buildPhieuHtml = (item, extra = {}, mode = 'print') => {
    const isCreateMode = mode === 'create';

    const maPhieu =
      extra.maPhieu ||
      extra.maphieu ||
      item.maPhieu ||
      item.maphieu ||
      taoMaPhieuTam();

    const ngayThanhToan =
      extra.ngayThanhToan ||
      extra.ngaythanhtoan ||
      item.ngayThanhToan ||
      item.ngaythanhtoan ||
      new Date().toISOString();

    const hinhThucThanhToan =
      extra.hinhThucThanhToan ||
      extra.hinhthuctt ||
      item.hinhThucThanhToan ||
      item.hinhthuctt ||
      'Chuyển khoản';

    const manv2 = extra.manv2 || getNhanVienDangNhap();
    const tenNhanVien = extra.tenNhanVien || getTenNhanVienDangNhap();

    const apiDoiTrangThaiUrl = apiUrl('/PhieuThanhToan/DoiTrangThai');

    const payload = {
      mahv: item.maHocVien,
      manv2: manv2,
      malop: item.maLop,
      trangThai: 'DA_THANH_TOAN',
      hinhthuctt: hinhThucThanhToan,
    };

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8" />
        <title>Phiếu thanh toán ${escapeHtml(maPhieu)}</title>
        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 32px;
            font-family: Arial, Helvetica, sans-serif;
            color: #111827;
            background: #f3f4f6;
          }

          .receipt {
            max-width: 820px;
            margin: 0 auto;
            padding: 36px;
            background: #ffffff;
            border-radius: 18px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
          }

          .header {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            padding-bottom: 18px;
            border-bottom: 2px solid #2563eb;
          }

          .brand h2 {
            margin: 0 0 6px;
            color: #1d4ed8;
            font-size: 22px;
            text-transform: uppercase;
          }

          .brand p {
            margin: 3px 0;
            color: #6b7280;
            font-size: 13px;
          }

          .meta {
            text-align: right;
            font-size: 13px;
            color: #374151;
          }

          .meta strong {
            color: #111827;
          }

          .title {
            margin: 30px 0 24px;
            text-align: center;
          }

          .title h1 {
            margin: 0 0 8px;
            font-size: 28px;
            color: #111827;
            text-transform: uppercase;
            letter-spacing: 0.04em;
          }

          .title p {
            margin: 0;
            color: #6b7280;
          }

          .section-title {
            margin: 26px 0 12px;
            padding: 10px 14px;
            border-radius: 10px;
            background: #eff6ff;
            color: #1d4ed8;
            font-weight: 700;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td, th {
            padding: 12px 14px;
            border: 1px solid #e5e7eb;
            vertical-align: top;
            font-size: 14px;
          }

          th {
            width: 32%;
            background: #f9fafb;
            text-align: left;
            color: #374151;
          }

          .money {
            color: #dc2626;
            font-size: 20px;
            font-weight: 800;
          }

          .status-waiting {
            color: #b45309;
            font-weight: 800;
          }

          .status-paid {
            color: #16a34a;
            font-weight: 800;
          }

          .note {
            margin-top: 18px;
            padding: 14px 16px;
            border-radius: 12px;
            background: #fef3c7;
            color: #92400e;
            font-size: 13px;
            line-height: 1.5;
          }

          .signatures {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 40px;
            margin-top: 42px;
            text-align: center;
          }

          .signature-box {
            min-height: 120px;
          }

          .signature-box strong {
            display: block;
            margin-bottom: 8px;
          }

          .signature-box span {
            color: #6b7280;
            font-size: 13px;
          }

          .actions {
            max-width: 820px;
            margin: 18px auto 0;
            display: flex;
            justify-content: center;
            gap: 12px;
          }

          .actions button {
            border: 0;
            border-radius: 999px;
            padding: 12px 24px;
            font-weight: 700;
            cursor: pointer;
          }

          .confirm-btn {
            background: #16a34a;
            color: #ffffff;
          }

          .print-btn {
            background: #2563eb;
            color: #ffffff;
          }

          .close-btn {
            background: #e5e7eb;
            color: #111827;
          }

          .confirm-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
          }

          @media print {
            body {
              background: #ffffff;
              padding: 0;
            }

            .receipt {
              box-shadow: none;
              border: 0;
              border-radius: 0;
              max-width: 100%;
            }

            .actions {
              display: none;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">
          <div class="header">
            <div class="brand">
              <h2>LanguageForLife</h2>
              <p>Trung tâm Ngoại ngữ - Tin học</p>
              <p>Địa chỉ: Trà Vinh, Việt Nam</p>
              <p>Điện thoại: 0123 456 789</p>
            </div>

            <div class="meta">
              <p><strong>Mã phiếu:</strong> <span id="maPhieuText">${escapeHtml(maPhieu)}</span></p>
              <p><strong>Ngày lập:</strong> ${escapeHtml(formatDate(ngayThanhToan))}</p>
              <p><strong>Nhân viên:</strong> ${escapeHtml(manv2)}</p>
            </div>
          </div>

          <div class="title">
            <h1>Phiếu thu học phí</h1>
            <p>
              ${
                isCreateMode
                  ? 'Vui lòng kiểm tra thông tin trước khi xác nhận lập phiếu'
                  : 'Xác nhận học viên đã thanh toán học phí cho lớp học đã đăng ký'
              }
            </p>
          </div>

          <div class="section-title">Thông tin học viên</div>
          <table>
            <tbody>
              <tr>
                <th>Mã học viên</th>
                <td>${escapeHtml(item.maHocVien || '-')}</td>
              </tr>
              <tr>
                <th>Họ tên học viên</th>
                <td>${escapeHtml(item.tenHocVien || '-')}</td>
              </tr>
              <tr>
                <th>Số điện thoại / Email</th>
                <td>${escapeHtml(item.sdt || item.email || '-')}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Thông tin lớp học</div>
          <table>
            <tbody>
              <tr>
                <th>Mã lớp</th>
                <td>${escapeHtml(item.maLop || '-')}</td>
              </tr>
              <tr>
                <th>Tên lớp</th>
                <td>${escapeHtml(item.tenLop || '-')}</td>
              </tr>
              <tr>
                <th>Khóa học</th>
                <td>${escapeHtml(item.tenKhoaHoc || '-')}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title">Thông tin thanh toán</div>
          <table>
            <tbody>
              <tr>
                <th>Số tiền</th>
                <td class="money">${escapeHtml(formatVND(item.hocPhi))}</td>
              </tr>
              <tr>
                <th>Hình thức thanh toán</th>
                <td>${escapeHtml(hinhThucThanhToan)}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td id="trangThaiPhieu" class="${isCreateMode ? 'status-waiting' : 'status-paid'}">
                  ${isCreateMode ? 'Chờ xác nhận lập phiếu' : 'Đã thanh toán'}
                </td>
              </tr>
              <tr>
                <th>Người lập phiếu</th>
                <td>${escapeHtml(tenNhanVien)}</td>
              </tr>
            </tbody>
          </table>

          <div class="note" id="receiptNote">
            ${
              isCreateMode
                ? 'Phiếu này đang ở trạng thái xem trước. Dữ liệu chỉ được lưu khi kế toán bấm nút Xác nhận lập phiếu.'
                : 'Phiếu thu này được lập sau khi kế toán trung tâm kiểm tra và xác nhận học phí đã được thanh toán. Học viên vui lòng giữ phiếu để đối chiếu khi cần thiết.'
            }
          </div>

          <div class="signatures">
            <div class="signature-box">
              <strong>Người nộp tiền</strong>
              <span>Ký và ghi rõ họ tên</span>
            </div>

            <div class="signature-box">
              <strong>Người lập phiếu</strong>
              <span>Ký và ghi rõ họ tên</span>
            </div>
          </div>
        </div>

        <div class="actions">
          ${
            isCreateMode
              ? `
                <button id="confirmBtn" class="confirm-btn" onclick="xacNhanLapPhieu()">
                  Xác nhận lập phiếu
                </button>

                <button id="printBtn" class="print-btn" style="display:none;" onclick="window.print()">
                  In phiếu
                </button>
              `
              : `
                <button class="print-btn" onclick="window.print()">
                  In phiếu
                </button>
              `
          }

          <button class="close-btn" onclick="window.close()">Đóng</button>
        </div>

        ${
          isCreateMode
            ? `
              <script>
                const payload = ${JSON.stringify(payload)};
                const apiUrl = ${JSON.stringify(apiDoiTrangThaiUrl)};

                async function xacNhanLapPhieu() {
                  const confirmBtn = document.getElementById('confirmBtn');
                  const printBtn = document.getElementById('printBtn');
                  const statusText = document.getElementById('trangThaiPhieu');
                  const note = document.getElementById('receiptNote');
                  const maPhieuText = document.getElementById('maPhieuText');

                  confirmBtn.disabled = true;
                  confirmBtn.innerText = 'Đang xác nhận...';

                  try {
                    const res = await fetch(apiUrl, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(payload)
                    });

                    const data = await res.json().catch(function () {
                      return {};
                    });

                    if (!res.ok) {
                      alert(data.message || 'Không lập được phiếu thanh toán.');
                      confirmBtn.disabled = false;
                      confirmBtn.innerText = 'Xác nhận lập phiếu';
                      return;
                    }

                    const maPhieuMoi =
                      data.maPhieu ||
                      data.maphieu ||
                      data.maPhieuThanhToan ||
                      data.maPT ||
                      '';

                    if (maPhieuMoi) {
                      maPhieuText.innerText = maPhieuMoi;
                    }

                    statusText.innerText = 'Đã thanh toán';
                    statusText.className = 'status-paid';
                    note.innerText = 'Phiếu thu đã được lập thành công. Có thể in phiếu để lưu hoặc giao cho học viên.';

                    confirmBtn.style.display = 'none';
                    printBtn.style.display = 'inline-block';

                    if (window.opener && !window.opener.closed) {
                      window.opener.postMessage({ type: 'HOCPHI_DA_LAP_PHIEU' }, '*');
                    }

                    alert(data.message || 'Đã lập phiếu thanh toán thành công.');
                  } catch (error) {
                    alert('Không kết nối được API lập phiếu thanh toán.');
                    confirmBtn.disabled = false;
                    confirmBtn.innerText = 'Xác nhận lập phiếu';
                  }
                }
              </script>
            `
            : ''
        }
      </body>
      </html>
    `;
  };

  const openPhieuWindow = (item, extra = {}, mode = 'print') => {
    const printWindow = window.open('', '_blank', 'width=900,height=700');

    if (!printWindow) {
      showAlert('Trình duyệt đang chặn cửa sổ phiếu. Vui lòng cho phép popup.', 'warning');
      return;
    }

    printWindow.document.write(buildPhieuHtml(item, extra, mode));
    printWindow.document.close();
    printWindow.focus();
  };

  const handleInPhieu = (item, extra = {}) => {
    openPhieuWindow(item, extra, 'print');
  };

  const handleLapPhieu = (item) => {
    if (getTrangThaiPhieu(item) === 'DA_THANH_TOAN') {
      showAlert('Học viên này đã có phiếu thanh toán.', 'info');
      return;
    }

    if (!isDangKyDaDuyet(item)) {
      showAlert('Chỉ lập phiếu cho học viên đã được duyệt ghi danh.', 'warning');
      return;
    }

    openPhieuWindow(
      item,
      {
        maPhieu: taoMaPhieuTam(),
        ngayThanhToan: new Date().toISOString(),
        manv2: getNhanVienDangNhap(),
        tenNhanVien: getTenNhanVienDangNhap(),
        hinhThucThanhToan: 'Chuyen khoan',
      },
      'create'
    );
  };

  const filteredRows = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return rows.filter((item) => {
      const matchesKeyword =
        !normalizedKeyword ||
        `${item.maHocVien} ${item.tenHocVien} ${item.maLop} ${item.tenLop} ${item.tenKhoaHoc}`
          .toLowerCase()
          .includes(normalizedKeyword);

      const trangThaiPhieu = getTrangThaiPhieu(item);

      const matchesStatus =
        status === 'all' ||
        (status === 'paid' && trangThaiPhieu === 'DA_THANH_TOAN') ||
        (status === 'unpaid' && trangThaiPhieu === 'CHUA_THANH_TOAN') ||
        (status === 'waiting' && trangThaiPhieu === 'CHO_XAC_NHAN') ||
        (status === 'cancel' && trangThaiPhieu === 'HUY');

      return matchesKeyword && matchesStatus;
    });
  }, [rows, keyword, status]);

  const summary = useMemo(() => {
    return filteredRows.reduce(
      (acc, item) => {
        const amount = Number(item.hocPhi || 0);
        const trangThaiPhieu = getTrangThaiPhieu(item);

        acc.total += amount;

        if (trangThaiPhieu === 'DA_THANH_TOAN') {
          acc.paid += amount;
        } else {
          acc.unpaid += amount;
        }

        return acc;
      },
      { total: 0, paid: 0, unpaid: 0 }
    );
  }, [filteredRows]);

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">
            Quản lý phiếu thanh toán
          </h3>

          <p className="text-secondary mb-0">
            Theo dõi phiếu thanh toán, cập nhật trạng thái, sửa hình thức thanh toán và in phiếu cho học viên.
          </p>
        </div>

        <button
          className="btn btn-primary fw-bold"
          onClick={fetchHocPhi}
        >
          Tải lại
        </button>
      </div>

      <div className="alert alert-info border-0 rounded-4 mb-4">
        <div className="fw-bold mb-1">
          Quy trình xác nhận phiếu thanh toán
        </div>

        <div>
  Học viên đăng ký lớp sẽ ở trạng thái <strong>chờ duyệt</strong>.
  Sau khi admin hoặc nhân viên bấm <strong>Duyệt ghi danh</strong>,
  hệ thống mới tạo phiếu thanh toán ở trạng thái <strong>Chưa thanh toán</strong>.
  Kế toán hoặc admin có thể cập nhật trạng thái, sửa hình thức thanh toán và in phiếu.
</div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="border rounded-3 p-3 bg-light">
            <div className="text-secondary small">
              Tổng học phí
            </div>

            <div className="fs-4 fw-bold text-dark">
              {formatVND(summary.total)}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded-3 p-3 bg-light">
            <div className="text-secondary small">
              Đã thanh toán
            </div>

            <div className="fs-4 fw-bold text-success">
              {formatVND(summary.paid)}
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="border rounded-3 p-3 bg-light">
            <div className="text-secondary small">
              Chưa thanh toán / chờ xử lý
            </div>

            <div className="fs-4 fw-bold text-danger">
              {formatVND(summary.unpaid)}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-8">
          <input
            className="form-control"
            placeholder="Tìm theo mã học viên, tên học viên, lớp hoặc khóa học"
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select
            className="form-select"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="all">
              Tất cả trạng thái
            </option>

            <option value="paid">
              Đã thanh toán
            </option>

            <option value="unpaid">
              Chưa thanh toán
            </option>

            <option value="waiting">
              Chờ xác nhận
            </option>

            <option value="cancel">
              Hủy phiếu
            </option>
          </select>
        </div>
      </div>

      <div className="table-responsive border rounded-3">
        <table className="table table-hover align-middle mb-0">
          <thead className="table-dark">
            <tr>
              <th className="ps-3 py-3">
                Học viên
              </th>

              <th className="py-3">
                Lớp / khóa học
              </th>

              <th className="py-3 text-end">
                Học phí
              </th>

              <th className="py-3 text-center">
                Đăng ký
              </th>

              <th className="py-3 text-center">
                Thanh toán
              </th>

              <th className="py-3">
                Phiếu thanh toán
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-5">
                  <div className="spinner-border text-primary"></div>
                </td>
              </tr>
            ) : filteredRows.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-4 text-muted">
                  Không có dữ liệu phiếu thanh toán.
                </td>
              </tr>
            ) : (
              filteredRows.map((item, index) => {
                const daDuyet = isDangKyDaDuyet(item);
                const trangThaiPhieu = getTrangThaiPhieu(item);

                return (
                  <tr key={`${item.maHocVien}-${item.maLop}-${index}`}>
                    <td className="ps-3">
                      <div className="fw-bold text-primary">
                        {item.maHocVien}
                      </div>

                      <div className="fw-semibold">
                        {item.tenHocVien}
                      </div>

                      <div className="small text-muted">
                        {item.sdt || item.email || ''}
                      </div>
                    </td>

                    <td>
                      <div className="fw-semibold">
                        {item.maLop} - {item.tenLop}
                      </div>

                      <div className="small text-muted">
                        {item.tenKhoaHoc}
                      </div>
                    </td>

                    <td className="text-end fw-bold text-danger">
                      {formatVND(item.hocPhi)}
                    </td>

                    <td className="text-center">
                      <span className={`badge ${daDuyet ? 'bg-success' : 'bg-secondary'}`}>
                        {item.trangThaiDangKy || 'Đã duyệt'}
                      </span>

                      <div className="small text-muted mt-1">
                        {formatDate(item.ngayDangKy)}
                      </div>
                    </td>

                    <td className="text-center" style={{ minWidth: 180 }}>
                      <select
                        className={`form-select form-select-sm fw-bold text-center ${getSelectClass(trangThaiPhieu)}`}
                        value={trangThaiPhieu}
                        onChange={(event) => handleDoiTrangThaiPhieu(item, event.target.value)}
                        disabled={!daDuyet}
                        title={!daDuyet ? 'Chỉ cập nhật khi đăng ký đã được duyệt' : ''}
                      >
                        <option value="CHUA_THANH_TOAN">
                          Chưa thanh toán
                        </option>

                        <option value="CHO_XAC_NHAN">
                          Chờ xác nhận
                        </option>

                        <option value="DA_THANH_TOAN">
                          Đã thanh toán
                        </option>

                        <option value="HUY">
                          Hủy phiếu
                        </option>
                      </select>

                      <div className="small text-muted mt-1">
                        {formatDate(item.ngayThanhToan)}
                      </div>
                    </td>

                    <td style={{ minWidth: 210 }}>
                      {item.maPhieu ? (
                        <>
                          <div className="fw-semibold text-success">
                            {item.maPhieu}
                          </div>

                          <div className="small text-muted mb-2">
                            {item.hinhThucThanhToan || item.hinhthuctt || getTenTrangThaiPhieu(trangThaiPhieu)}
                          </div>

                          <div className="d-flex flex-wrap gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-pill fw-bold px-3"
                              onClick={() => handleInPhieu(item)}
                              disabled={trangThaiPhieu !== 'DA_THANH_TOAN'}
                              title={
                                trangThaiPhieu !== 'DA_THANH_TOAN'
                                  ? 'Chỉ in phiếu khi đã thanh toán'
                                  : ''
                              }
                            >
                              In phiếu
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary rounded-pill fw-bold px-3"
                              onClick={() => handleSuaHinhThucThanhToan(item)}
                            >
                              Sửa
                            </button>
                          </div>
                        </>
                      ) : (
                        <span className="text-muted small">
                          Chưa có phiếu
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}