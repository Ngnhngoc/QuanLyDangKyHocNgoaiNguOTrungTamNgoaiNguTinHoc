import React, { useState, useEffect } from 'react';

export default function AdminGiangVien() {
  const [dsGiangVien, setDsGiangVien] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Form nhập liệu
  const [maGV, setMaGV] = useState('');
  const [tenGV, setTenGV] = useState('');
  const [sdt, setSdt] = useState('');
  const [email, setEmail] = useState('');
  const [chuyenMon, setChuyenMon] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch('http://localhost:5052/api/GiangVien');
      if (res.ok) {
        const data = await res.json();
        setDsGiangVien(data);
      }
    } catch (err) {
      console.error("Lỗi tải dữ liệu:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!maGV || !tenGV) {
      alert("Vui lòng nhập ít nhất Mã và Tên giảng viên!");
      return;
    }

    const url = isEditing 
      ? `http://localhost:5052/api/GiangVien/${maGV}` 
      : 'http://localhost:5052/api/GiangVien';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        // 👉 ĐÃ SỬA: Khớp đúng tên Model C# (Có chữ nv)
        body: JSON.stringify({ 
          Magv: maGV, 
          Tennv: tenGV, 
          Sdtnv: sdt, 
          Emailnv: email,
          Chuyenmon: chuyenMon 
        })
      });

      if (res.ok) {
        alert(isEditing ? "Cập nhật thành công!" : "Thêm giảng viên thành công!");
        resetForm();
        fetchData();
      } else {
        alert("Thao tác thất bại! Kiểm tra lại mã giảng viên có bị trùng không.");
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa giảng viên [${id}] không?`)) return;

    try {
      const res = await fetch(`http://localhost:5052/api/GiangVien/${id}`, { method: 'DELETE' });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchData();
      } else {
        const errorData = await res.json();
        alert("⛔ " + (errorData.message || "Không thể xóa! Giảng viên này đang được phân công giảng dạy."));
      }
    } catch (error) {
      alert("Lỗi kết nối Server!");
    }
  };

  const handleEditClick = (item) => {
    // 👉 ĐÃ SỬA: Đọc đúng biến từ API trả về (tennv, sdtnv...)
    setMaGV(item.maGV);
    setTenGV(item.tennv);
    setSdt(item.sdtnv || '');
    setEmail(item.emailnv || '');
    setChuyenMon(item.chuyenmon || '');
    setIsEditing(true);
  };

  const resetForm = () => {
    setMaGV('');
    setTenGV('');
    setSdt('');
    setEmail('');
    setChuyenMon('');
    setIsEditing(false);
  };

  return (
    <div className="container-fluid py-2">
      <h3 className="fw-bold text-dark mb-4 border-bottom pb-2">👨‍🏫 QUẢN LÝ HỒ SƠ GIẢNG VIÊN</h3>

      <div className="row">
        {/* === FORM NHẬP LIỆU BÊN TRÁI === */}
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header text-white fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-success'}`}>
              {isEditing ? "✏️ CẬP NHẬT HỒ SƠ" : "➕ THÊM GIẢNG VIÊN"}
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã Giảng Viên</label>
                  <input 
                    type="text" className="form-control" 
                    value={maGV} onChange={(e) => setMaGV(e.target.value.toUpperCase())}
                    disabled={isEditing} placeholder="VD: GV01, GV_TOAN..." required 
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label fw-semibold">Họ và Tên</label>
                  <input 
                    type="text" className="form-control" 
                    value={tenGV} onChange={(e) => setTenGV(e.target.value)}
                    placeholder="VD: Nguyễn Văn A" required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Số điện thoại</label>
                  <input 
                    type="text" className="form-control" 
                    value={sdt} onChange={(e) => setSdt(e.target.value)}
                    placeholder="VD: 0909123456" 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input 
                    type="email" className="form-control" 
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="VD: gv.nguyenvana@gmail.com" 
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label fw-semibold">Chuyên môn (Tự chọn)</label>
                  <input 
                    type="text" className="form-control" 
                    value={chuyenMon} onChange={(e) => setChuyenMon(e.target.value)}
                    placeholder="VD: IELTS, Giao tiếp..." 
                  />
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className={`btn fw-bold w-100 text-white ${isEditing ? 'btn-warning' : 'btn-success'}`}>
                    {isEditing ? "LƯU THAY ĐỔI" : "TẠO HỒ SƠ"}
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
                <div className="text-center py-5"><div className="spinner-border text-success"></div></div>
              ) : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th className="ps-3 py-3">Mã GV</th>
                      <th className="py-3">Họ và Tên</th>
                      <th className="py-3">Liên hệ</th>
                      <th className="py-3">Chuyên môn</th>
                      <th className="py-3 text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dsGiangVien.map((item, index) => (
                      <tr key={index}>
                        <td className="ps-3 py-3 fw-bold text-success">{item.maGV}</td>
                        {/* 👉 ĐÃ SỬA: Đọc đúng biến tennv, sdtnv... */}
                        <td className="py-3 fw-semibold text-dark">{item.tennv}</td>
                        <td className="py-3">
                          <div className="small">{item.sdtnv}</div>
                          <div className="small text-muted">{item.emailnv}</div>
                        </td>
                        <td className="py-3"><span className="badge bg-info text-dark">{item.chuyenmon}</span></td>
                        <td className="py-3 text-center">
                          <button onClick={() => handleEditClick(item)} className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2 fw-bold">Sửa</button>
                          <button onClick={() => handleDelete(item.maGV)} className="btn btn-sm btn-outline-danger rounded-pill px-3 fw-bold">Xóa</button>
                        </td>
                      </tr>
                    ))}
                    {dsGiangVien.length === 0 && (
                      <tr><td colSpan="5" className="text-center py-4 text-muted">Chưa có dữ liệu giảng viên.</td></tr>
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