import React, { useState, useEffect } from 'react';

export default function AdminKhoaHoc() {
  const [dsKhoaHoc, setDsKhoaHoc] = useState([]);
  const [dsNgonNgu, setDsNgonNgu] = useState([]); 
  const [loading, setLoading] = useState(true);

  // State cho Form
  const [maKh, setMaKh] = useState('');
  const [tenKh, setTenKh] = useState('');
  const [maNn, setMaNn] = useState('');
  const [hocPhi, setHocPhi] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // 1. GỌI SONG SONG 2 API ĐỂ LẤY DỮ LIỆU BẢNG VÀ DỮ LIỆU DROPDOWN
  const fetchData = async () => {
    try {
      const [resKh, resNn] = await Promise.all([
        fetch('http://localhost:5052/api/KhoaHoc'),
        fetch('http://localhost:5052/api/DanhMucNN') 
      ]);

      if (resKh.ok) setDsKhoaHoc(await resKh.json());
      if (resNn.ok) setDsNgonNgu(await resNn.json());
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. XỬ LÝ THÊM / CẬP NHẬT (ĐÃ CHUẨN HÓA TÊN BIẾN GỬI VỀ C#)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maKh || !tenKh || !maNn || !hocPhi) {
      alert("Vui lòng điền đầy đủ thông tin khóa học!");
      return;
    }

    const url = isEditing 
      ? `http://localhost:5052/api/KhoaHoc/${maKh}` 
      : 'http://localhost:5052/api/KhoaHoc';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          Makh: maKh, 
          Tenkh: tenKh, 
          Madanhmuc: maNn, // Trỏ đúng tên cột Khóa ngoại của C#
          Hocphi: parseFloat(hocPhi) 
        })
      });

      if (res.ok) {
        alert(isEditing ? "Cập nhật khóa học thành công!" : "Thêm khóa học mới thành công!");
        resetForm();
        fetchData();
      } else {
        alert("Thao tác thất bại! Hãy kiểm tra lại dữ liệu.");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  // 3. XỬ LÝ XÓA
const handleDelete = async (id) => {
  if (!window.confirm(`Bạn có chắc muốn xóa khóa học [${id}] không?`)) return;

  try {
    const res = await fetch(`http://localhost:5052/api/KhoaHoc/${id}`, { method: 'DELETE' });
    if (res.ok) {
      alert("Xóa khóa học thành công!");
      fetchData();
    } else {
      // ĐỌC CÂU LỖI TỪ C# GỬI VỀ VÀ HIỂN THỊ LÊN
      const errorData = await res.json();
      alert("⛔ " + (errorData.message || "Không thể xóa dữ liệu này!"));
    }
  } catch (error) {
    alert("Lỗi kết nối Server!");
  }
};

  // 4. BẤM NÚT SỬA SẼ ĐỔ DỮ LIỆU LÊN FORM (ĐÃ SỬA TÊN BIẾN MAKH, TENKH...)
  const handleEditClick = (item) => {
    setMaKh(item.maKH);
    setTenKh(item.tenKH);
    setMaNn(item.maDanhMuc || ''); 
    setHocPhi(item.hocPhi || '');
    setIsEditing(true);
  };

  const resetForm = () => {
    setMaKh('');
    setTenKh('');
    setMaNn('');
    setHocPhi('');
    setIsEditing(false);
  };

  return (
    <div className="container-fluid py-2">
      <h3 className="fw-bold text-dark mb-4 border-bottom pb-2">📚 QUẢN LÝ DANH MỤC KHÓA HỌC</h3>

      <div className="row">
        {/* === FORM NHẬP LIỆU BÊN TRÁI === */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header text-white fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-danger'}`}>
              {isEditing ? "✏️ CẬP NHẬT KHÓA HỌC" : "➕ THÊM KHÓA HỌC MỚI"}
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã Khóa Học</label>
                  <input 
                    type="text" className="form-control" 
                    value={maKh} onChange={(e) => setMaKh(e.target.value.toUpperCase())}
                    disabled={isEditing} placeholder="VD: KH_IELTS, KH_TOPIK" required 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Tên Khóa Học</label>
                  <input 
                    type="text" className="form-control" 
                    value={tenKh} onChange={(e) => setTenKh(e.target.value)}
                    placeholder="VD: IELTS Cam Kết Đầu Ra 6.5+" required 
                  />
                </div>

                {/* DROPDOWN NGÔN NGỮ ĐÃ ĐƯỢC CHUẨN HÓA LẠI maDanhMuc VÀ tenDanhMuc */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Thuộc Ngôn Ngữ</label>
                  <select 
                    className="form-select" 
                    value={maNn} onChange={(e) => setMaNn(e.target.value)} required
                  >
                    <option value="">-- Chọn ngôn ngữ --</option>
                    {dsNgonNgu.map((nn) => (
                      <option key={nn.maDanhMuc} value={nn.maDanhMuc}>{nn.tenDanhMuc}</option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Học Phí (VNĐ)</label>
                  <input 
                    type="number" className="form-control" 
                    value={hocPhi} onChange={(e) => setHocPhi(e.target.value)}
                    placeholder="VD: 5000000" required 
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className={`btn fw-bold w-100 text-white ${isEditing ? 'btn-warning' : 'btn-danger'}`}>
                    {isEditing ? "LƯU THAY ĐỔI" : "TẠO KHÓA HỌC"}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary fw-bold">HỦY</button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* === BẢNG DỮ LIỆU BÊN PHẢI === */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-3 py-3">Mã Khóa</th>
                      <th className="py-3">Tên Khóa Học</th>
                      <th className="py-3">Ngôn Ngữ</th>
                      <th className="py-3">Học Phí</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsKhoaHoc.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-3 py-3 fw-bold text-secondary">{item.maKH}</td>
                        <td className="py-3 fw-semibold text-dark">{item.tenKH}</td>
                        <td className="py-3"><span className="badge bg-secondary">{item.danhMuc}</span></td>
                        <td className="py-3 text-danger fw-bold">
                          {item.hocPhi ? item.hocPhi.toLocaleString('vi-VN') : 0} đ
                        </td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2 fw-bold">Sửa</button>
                          <button onClick={() => handleDelete(item.maKH)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">Xóa</button>
                        </td>
                      </tr>
                    ))}
                    {dsKhoaHoc.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có dữ liệu khóa học nào.</td></tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}