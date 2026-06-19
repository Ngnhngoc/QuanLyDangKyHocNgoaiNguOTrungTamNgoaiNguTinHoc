import React, { useState, useEffect } from 'react';
import { apiUrl } from '../services/api';

export default function AdminNgonNgu() {
  const [dsNgonNgu, setDsNgonNgu] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Form
  const [maNn, setMaNn] = useState('');
  const [tenNn, setTenNn] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Gọi API lấy dữ liệu
  const fetchNgonNgu = async () => {
    try {
      const res = await fetch(apiUrl('/DanhMucNN'));
      if (res.ok) {
        const data = await res.json();
        setDsNgonNgu(data);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNgonNgu();
  }, []);

  // Hàm Lưu (Dùng chung cho cả Thêm và Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maNn || !tenNn) {
      alert("Vui lòng nhập đủ Mã và Tên ngôn ngữ!");
      return;
    }

    const url = isEditing 
      ? apiUrl(`/DanhMucNN/${maNn}`) 
      : apiUrl('/DanhMucNN');
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ madanhmuc: maNn, tendanhmuc: tenNn })
      });

      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm mới thành công!");
        resetForm();
        fetchNgonNgu(); // Tải lại bảng dữ liệu
      } else {
        alert("Thao tác thất bại! Kiểm tra lại mã (có thể bị trùng).");
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  // Hàm Xóa
  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa ngôn ngữ mã [${id}] không?`)) return;

    try {
      const res = await fetch(apiUrl(`/DanhMucNN/${id}`), { method: 'DELETE' });
      if (res.ok) {
        alert("Đã xóa thành công!");
        fetchNgonNgu();
      } else {
        alert("Không thể xóa! Ngôn ngữ này có thể đang được dùng trong Khóa Học.");
      }
    } catch (error) {
      alert("Lỗi kết nối đến máy chủ!");
    }
  };

  // Nút Bấm Sửa
  const handleEditClick = (item) => {
  setMaNn(item.maDanhMuc);   // Sửa ở đây
  setTenNn(item.tenDanhMuc); // Sửa ở đây
  setIsEditing(true);
};

  // Nút Hủy
  const resetForm = () => {
    setMaNn('');
    setTenNn('');
    setIsEditing(false);
  };

  return (
    <div className="container-fluid py-2">
      <h3 className="fw-bold text-dark mb-4 border-bottom pb-2">📂 QUẢN LÝ DANH MỤC NGÔN NGỮ</h3>
      
      <div className="row">
        {/* CỘT TRÁI: FORM NHẬP LIỆU */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header text-white fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-primary'}`}>
              {isEditing ? "✏️ CẬP NHẬT NGÔN NGỮ" : "➕ THÊM NGÔN NGỮ MỚI"}
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã Ngôn Ngữ</label>
                  <input 
                    type="text" className="form-control" 
                    value={maNn} onChange={(e) => setMaNn(e.target.value.toUpperCase())}
                    disabled={isEditing} /* Khi đang sửa thì không cho đổi Mã */
                    placeholder="VD: ENG, KOR, JPN..." required 
                  />
                  {isEditing && <small className="text-danger">Không thể thay đổi Mã ngôn ngữ</small>}
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Tên Ngôn Ngữ</label>
                  <input 
                    type="text" className="form-control" 
                    value={tenNn} onChange={(e) => setTenNn(e.target.value)}
                    placeholder="VD: Tiếng Anh, Tiếng Hàn..." required 
                  />
                </div>
                <div className="d-flex gap-2">
                  <button type="submit" className={`btn fw-bold w-100 text-white ${isEditing ? 'btn-warning' : 'btn-primary'}`}>
                    {isEditing ? "LƯU CẬP NHẬT" : "THÊM MỚI"}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="btn btn-secondary fw-bold">
                      HỦY
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: BẢNG DỮ LIỆU */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-4 py-3">Mã NN</th>
                      <th className="py-3">Tên Ngôn Ngữ</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsNgonNgu.map((item, index) => (
  <tr key={index}>
    {/* SỬA 2 DÒNG td NÀY */}
    <td className="ps-4 py-3 fw-bold text-danger">{item.maDanhMuc}</td>
    <td className="py-3 fw-semibold">{item.tenDanhMuc}</td>
    
    <td className="py-3 text-center">
      <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2 fw-bold">
        Sửa
      </button>
      {/* SỬA LUÔN NÚT XÓA ĐỂ NÓ NHẬN ĐÚNG MÃ */}
      <button onClick={() => handleDelete(item.maDanhMuc)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">
        Xóa
      </button>
    </td>
  </tr>
))}
                    {dsNgonNgu.length === 0 && (
                      <tr><td colSpan="3" className="text-center py-4 text-muted">Chưa có dữ liệu ngôn ngữ.</td></tr>
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
