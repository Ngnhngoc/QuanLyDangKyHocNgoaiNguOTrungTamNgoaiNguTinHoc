import React, { useState, useEffect } from 'react';

export default function AdminLopHoc() {
  const [dsLopHoc, setDsLopHoc] = useState([]);
  const [dsKhoaHoc, setDsKhoaHoc] = useState([]); 
  const [dsGiangVien, setDsGiangVien] = useState([]); 
  const [loading, setLoading] = useState(true);

  // === STATE MỚI CHO MODAL XEM DANH SÁCH HỌC VIÊN ===
  const [selectedLop, setSelectedLop] = useState(null); 
  const [dsHocVienTrongLop, setDsHocVienTrongLop] = useState([]);
  const [loadingHV, setLoadingHV] = useState(false);

  // State cho Form ĐẦY ĐỦ
  const [maLop, setMaLop] = useState('');
  const [tenLop, setTenLop] = useState('');
  const [maKh, setMaKh] = useState(''); 
  const [maGv, setMaGv] = useState(''); 
  const [siSo, setSiSo] = useState('');
  const [tongCho, setTongCho] = useState('');
  const [ngayHoc, setNgayHoc] = useState('');
  const [gioHoc, setGioHoc] = useState('');
  const [ngayKhaiGiang, setNgayKhaiGiang] = useState('');
  
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const [resLop, resKh, resGv] = await Promise.all([
        fetch('http://localhost:5052/api/LopHoc'),
        fetch('http://localhost:5052/api/KhoaHoc'),
        fetch('http://localhost:5052/api/GiangVien')
      ]);

      if (resLop.ok) setDsLopHoc(await resLop.json());
      if (resKh.ok) setDsKhoaHoc(await resKh.json());
      if (resGv.ok) setDsGiangVien(await resGv.json());
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === CÁC HÀM XỬ LÝ DANH SÁCH HỌC VIÊN (XEM, XÓA, IN) ===

  // 1. Mở Modal và lấy danh sách học viên từ API
  const handleOpenStudentList = async (lophoc) => {
    setSelectedLop(lophoc);
    setLoadingHV(true);
    try {
      const res = await fetch(`http://localhost:5052/api/LopHoc/${lophoc.maLop}/HocVien`);
      if (res.ok) {
        setDsHocVienTrongLop(await res.json());
      }
    } catch (err) {
      console.error("Lỗi lấy danh sách học viên:", err);
    } finally {
      setLoadingHV(false);
    }
  };

  // 2. Xóa học viên khỏi lớp
  const handleRemoveStudent = async (maHv) => {
    if (!window.confirm(`Bạn có chắc muốn xóa học viên [${maHv}] khỏi lớp này không?`)) return;
    try {
      const res = await fetch(`http://localhost:5052/api/LopHoc/${selectedLop.maLop}/HocVien/${maHv}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        alert("Đã xóa học viên khỏi lớp thành công!");
        // Gọi lại API load danh sách học viên để làm mới bảng Modal
        const reloadRes = await fetch(`http://localhost:5052/api/LopHoc/${selectedLop.maLop}/HocVien`);
        if (reloadRes.ok) setDsHocVienTrongLop(await reloadRes.json());
        // Gọi lại bảng lớp học bên ngoài để cập nhật sĩ số
        fetchData();
      } else {
        alert("Xóa thất bại!");
      }
    } catch (err) {
      alert("Lỗi kết nối Server!");
    }
  };

  // 3. In danh sách
  const handlePrintList = () => {
    if (dsHocVienTrongLop.length === 0) {
      alert("Lớp học này chưa có học viên nào để in danh sách!");
      return;
    }
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
      <html>
        <head>
          <title>Danh_Sach_Lop_${selectedLop.maLop}</title>
          <style>
            body { font-family: 'Times New Roman', serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; text-align: center; }
            .text-center { text-align: center; }
            .footer { margin-top: 30px; text-align: right; padding-right: 50px; }
          </style>
        </head>
        <body>
          <div class="header"><h2>DANH SÁCH HỌC VIÊN CHÍNH THỨC</h2></div>
          <p><strong>Mã lớp:</strong> ${selectedLop.maLop} - <strong>Tên lớp:</strong> ${selectedLop.tenLop}</p>
          <p><strong>Khóa học:</strong> ${selectedLop.tenKH} - <strong>Giảng viên:</strong> ${selectedLop.tenGV}</p>
          <table>
            <thead>
              <tr>
                <th width="5%">STT</th>
                <th width="15%">Mã HV</th>
                <th width="35%">Họ và Tên</th>
                <th width="20%">Số Điện Thoại</th>
                <th width="25%">Ghi chú (Ký tên)</th>
              </tr>
            </thead>
            <tbody>
              ${dsHocVienTrongLop.map((hv, index) => `
                <tr>
                  <td class="text-center">${index + 1}</td>
                  <td>${hv.maHV}</td>
                  <td>${hv.tenHV}</td>
                  <td>${hv.sdt || ''}</td>
                  <td></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p><em>Ngày lập bảng: ${new Date().toLocaleDateString('vi-VN')}</em></p>
            <p><strong>Người lập bảng (Ký tên)</strong></p>
          </div>
          <script>window.onload = function() { window.print(); window.onafterprint = function() { window.close(); } }</script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // === CÁC HÀM XỬ LÝ LỚP HỌC (THÊM, SỬA, XÓA) ===

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maLop || !tenLop || !maKh) {
      alert("Vui lòng điền đủ Mã lớp, Tên lớp và chọn Khóa học!");
      return;
    }

    const url = isEditing 
      ? `http://localhost:5052/api/LopHoc/${maLop}` 
      : 'http://localhost:5052/api/LopHoc';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Malop: maLop, 
          Tenlop: tenLop, 
          Makh: maKh, 
          Magv: maGv || null, 
          Siso: parseInt(siSo) || 0,
          Soluong: parseInt(tongCho) || 0,
          Ngayhoc: ngayHoc || null,
          Giohoc: gioHoc || null,
          Ngaybdhoc: ngayKhaiGiang ? new Date(ngayKhaiGiang).toISOString() : null
        })
      });

      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm lớp học thành công!");
        resetForm();
        fetchData();
      } else {
        alert("Thao tác thất bại! Kiểm tra lại mã lớp có bị trùng không.");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lớp học [${id}] không?`)) return;

    try {
      const res = await fetch(`http://localhost:5052/api/LopHoc/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchData();
      } else {
        alert("Không thể xóa lớp học này!");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  const formatDateForInput = (dateString) => {
    if (!dateString || dateString === "Đang cập nhật") return '';
    const parts = dateString.split('/');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return '';
  };

  const handleEditClick = (item) => {
    setMaLop(item.maLop);
    setTenLop(item.tenLop);
    setMaKh(item.maKH || ''); 
    setMaGv(item.maGV || '');
    setSiSo(item.siSo || '');
    setTongCho(item.tongCho || '');
    setNgayHoc(item.buoiHoc || '');
    setGioHoc(item.gioHoc || '');
    setNgayKhaiGiang(formatDateForInput(item.ngayKhaiGiang));
    setIsEditing(true);
  };

  const resetForm = () => {
    setMaLop('');
    setTenLop('');
    setMaKh('');
    setMaGv('');
    setSiSo('');
    setTongCho('');
    setNgayHoc('');
    setGioHoc('');
    setNgayKhaiGiang('');
    setIsEditing(false);
  };

  return (
    <div className="container-fluid py-2">
      <h3 className="fw-bold text-dark mb-4 border-bottom pb-2">🏫 QUẢN LÝ DANH SÁCH LỚP HỌC</h3>

      <div className="row">
        {/* === FORM NHẬP LIỆU === */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header text-white fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
              {isEditing ? "✏️ CẬP NHẬT LỚP HỌC" : "➕ MỞ LỚP MỚI"}
            </div>
            <div className="card-body bg-light" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã Lớp *</label>
                  <input type="text" className="form-control" value={maLop} onChange={(e) => setMaLop(e.target.value.toUpperCase())} disabled={isEditing} placeholder="VD: L01" required />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên Lớp *</label>
                  <input type="text" className="form-control" value={tenLop} onChange={(e) => setTenLop(e.target.value)} placeholder="VD: Lớp IELTS Tối 2-4-6" required />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-danger">Thuộc Khóa Học *</label>
                  <select className="form-select border-danger" value={maKh} onChange={(e) => setMaKh(e.target.value)} required>
                    <option value="">-- Chọn Khóa học --</option>
                    {dsKhoaHoc.map((kh) => <option key={kh.maKH} value={kh.maKH}>{kh.tenKH}</option>)}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold text-success">Giảng viên phụ trách</label>
                  <select className="form-select border-success" value={maGv} onChange={(e) => setMaGv(e.target.value)}>
                    <option value="">-- Chưa phân công --</option>
                    {dsGiangVien.map((gv) => <option key={gv.maGV} value={gv.maGV}>{gv.tennv}</option>)}
                  </select>
                </div>

                <div className="row">
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Đã Ghi Danh</label>
                    <input type="number" className="form-control" value={siSo} onChange={(e) => setSiSo(e.target.value)} placeholder="VD: 12" />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label fw-semibold">Tổng Chỗ (Max)</label>
                    <input type="number" className="form-control" value={tongCho} onChange={(e) => setTongCho(e.target.value)} placeholder="VD: 25" />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Ngày Khai Giảng</label>
                  <input type="date" className="form-control" value={ngayKhaiGiang} onChange={(e) => setNgayKhaiGiang(e.target.value)} />
                </div>

                <div className="row">
                  <div className="col-6 mb-4">
                    <label className="form-label fw-semibold">Buổi Học</label>
                    <input type="text" className="form-control" value={ngayHoc} onChange={(e) => setNgayHoc(e.target.value)} placeholder="T2-T4-T6" />
                  </div>
                  <div className="col-6 mb-4">
                    <label className="form-label fw-semibold">Giờ Học</label>
                    <input type="text" className="form-control" value={gioHoc} onChange={(e) => setGioHoc(e.target.value)} placeholder="19:00 - 21:00" />
                  </div>
                </div>

                <div className="d-flex gap-2 sticky-bottom bg-light pt-2">
                  <button type="submit" className={`btn fw-bold w-100 ${isEditing ? 'btn-warning' : 'btn-info'}`}>
                    {isEditing ? "LƯU THAY ĐỔI" : "MỞ LỚP NGAY"}
                  </button>
                  {isEditing && <button type="button" onClick={resetForm} className="btn btn-secondary fw-bold">HỦY</button>}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* === BẢNG DỮ LIỆU === */}
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-0 table-responsive">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-info"></div></div>
              ) : (
                <table className="table table-hover align-middle mb-0" style={{ minWidth: '800px' }}>
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-3 py-3">Lớp Học</th>
                      <th className="py-3">Phụ trách</th>
                      <th className="py-3">Lịch học</th>
                      <th className="py-3">Sĩ số & Tình trạng</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsLopHoc.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-3 py-3">
                          <div className="fw-bold text-info">{item.maLop} - {item.tenLop}</div>
                          <div className="small text-danger fw-semibold">{item.tenKH}</div>
                        </td>
                        <td className="py-3 fw-semibold text-success">{item.tenGV}</td>
                        <td className="py-3">
                          <div className="small fw-bold">K/G: {item.ngayKhaiGiang}</div>
                          <div className="small text-muted">{item.buoiHoc} {item.gioHoc ? `(${item.gioHoc})` : ''}</div>
                        </td>
                        <td className="py-3">
                          <div className="mb-1 fw-semibold text-dark">
                            {item.daGhiDanh} / {item.tongCho || '?'} học viên
                          </div>
                          <span className={`badge ${item.tinhTrang === 'Gần hết chỗ' ? 'bg-warning text-dark' : 'bg-success'}`}>
                            {item.tinhTrang}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          {/* 👉 NÚT XEM DANH SÁCH MỚI THÊM VÀO */}
                          <button onClick={() => handleOpenStudentList(item)} className="btn btn-sm btn-dark rounded-pill px-3 me-1 fw-bold">👁️ Xem DS</button>
                          <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary rounded-pill px-2 me-1 fw-bold">Sửa</button>
                          <button onClick={() => handleDelete(item.maLop)} className="btn btn-sm btn-outline-danger rounded-pill px-2 fw-bold">Xóa</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 🌟 HỘP THOẠI MODAL XEM DANH SÁCH SINH VIÊN TRONG LỚP 🌟 */}
      {/* ========================================================= */}
      {selectedLop && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-3">
              <div className="modal-header bg-dark text-white">
                <h5 className="modal-title fw-bold">📊 DANH SÁCH HỌC VIÊN - LỚP [{selectedLop.maLop}]</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setSelectedLop(null)}></button>
              </div>
              <div className="modal-body">
                <div className="alert alert-secondary p-2 small mb-3">
                  <strong>Khóa học:</strong> {selectedLop.tenKH} | <strong>Giảng viên:</strong> {selectedLop.tenGV}
                </div>

                {loadingHV ? (
                  <div className="text-center py-4"><div className="spinner-border text-primary"></div></div>
                ) : (
                  <div className="table-responsive" style={{ maxHeight: '40vh' }}>
                    <table className="table table-bordered table-striped align-middle mb-0">
                      <thead className="table-secondary text-center">
                        <tr>
                          <th width="8%">STT</th>
                          <th width="20%">Mã Học Viên</th>
                          <th>Họ và Tên</th>
                          <th width="15%">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dsHocVienTrongLop.map((hv, idx) => (
                          <tr key={idx}>
                            <td className="text-center fw-bold">{idx + 1}</td>
                            <td className="text-center text-primary fw-semibold">{hv.maHV}</td>
                            <td className="fw-semibold text-dark">{hv.tenHV}</td>
                            <td className="text-center">
                              <button onClick={() => handleRemoveStudent(hv.maHV)} className="btn btn-sm btn-danger rounded-pill px-3">Xóa</button>
                            </td>
                          </tr>
                        ))}
                        {dsHocVienTrongLop.length === 0 && (
                          <tr><td colSpan="4" className="text-center py-3 text-muted">Lớp này chưa có học viên đăng ký.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              <div className="modal-footer bg-light d-flex justify-content-between">
                <button onClick={handlePrintList} className="btn btn-success fw-bold" disabled={dsHocVienTrongLop.length === 0}>🖨️ IN DANH SÁCH LỚP</button>
                <button type="button" className="btn btn-secondary fw-bold" onClick={() => setSelectedLop(null)}>ĐÓNG</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}