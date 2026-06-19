import React, { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../services/api';

export default function AdminHocVien() {
  const [hocViens, setHocViens] = useState([]);
  const [lopHocs, setLopHocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    mahv: '',
    malop: '',
    hotenhv: '',
    ngaysinhhv: '',
    gioitinhhv: '',
    dienthoaihv: '',
    diachinv: '',
    emailhv: '',
    matkhauhv: ''
  });

  const normalizeDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [hvRes, lopRes] = await Promise.all([
        fetch(apiUrl('/Hocvien')),
        fetch(apiUrl('/LopHoc'))
      ]);
      if (hvRes.ok) setHocViens(await hvRes.json());
      if (lopRes.ok) setLopHocs(await lopRes.json());
    } catch (error) {
      console.error(error);
      alert('Không tải được dữ liệu học viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredHocViens = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return hocViens;
    return hocViens.filter((hv) => `${hv.mahv} ${hv.hotenhv} ${hv.dienthoaihv} ${hv.emailhv}`.toLowerCase().includes(q));
  }, [hocViens, keyword]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({ mahv: '', malop: '', hotenhv: '', ngaysinhhv: '', gioitinhhv: '', dienthoaihv: '', diachinv: '', emailhv: '', matkhauhv: '' });
    setIsEditing(false);
  };

  const handleEdit = (hv) => {
    setForm({
      mahv: hv.mahv || '',
      malop: hv.malop || '',
      hotenhv: hv.hotenhv || '',
      ngaysinhhv: normalizeDate(hv.ngaysinhhv),
      gioitinhhv: hv.gioitinhhv || '',
      dienthoaihv: hv.dienthoaihv || '',
      diachinv: hv.diachinv || '',
      emailhv: hv.emailhv || '',
      matkhauhv: hv.matkhauhv || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mahv || !form.hotenhv || !form.malop || !form.matkhauhv) {
      alert('Vui lòng nhập mã học viên, họ tên, lớp và mật khẩu.');
      return;
    }

    const payload = {
      mahv: form.mahv.trim().toUpperCase(),
      malop: form.malop,
      hotenhv: form.hotenhv.trim(),
      ngaysinhhv: form.ngaysinhhv ? new Date(form.ngaysinhhv).toISOString() : null,
      gioitinhhv: form.gioitinhhv || null,
      dienthoaihv: form.dienthoaihv || null,
      diachinv: form.diachinv || null,
      emailhv: form.emailhv || null,
      matkhauhv: form.matkhauhv || null,
      ngayhoc: null,
      buoihoc: null
    };

    const url = isEditing ? apiUrl(`/Hocvien/${payload.mahv}`) : apiUrl('/Hocvien');
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(isEditing ? 'Cập nhật học viên thành công!' : 'Thêm học viên thành công!');
        resetForm();
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Thao tác thất bại.');
      }
    } catch (error) {
      alert('Không kết nối được máy chủ.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa học viên [${id}] không?`)) return;
    try {
      const res = await fetch(apiUrl(`/Hocvien/${id}`), { method: 'DELETE' });
      if (res.ok) {
        alert('Xóa học viên thành công!');
        fetchData();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Không thể xóa học viên này.');
      }
    } catch (error) {
      alert('Không kết nối được máy chủ.');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">👨‍🎓 HỒ SƠ HỌC VIÊN</h3>
          <p className="text-secondary mb-0">Thêm, sửa, xóa và tra cứu thông tin học viên.</p>
        </div>
        <button className="btn btn-primary fw-bold" onClick={fetchData}>Tải lại</button>
      </div>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-primary text-white'}`}>
              {isEditing ? '✏️ Cập nhật học viên' : '➕ Thêm học viên'}
            </div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Mã học viên *</label>
                  <input className="form-control" value={form.mahv} disabled={isEditing} onChange={(e) => handleChange('mahv', e.target.value.toUpperCase())} placeholder="VD: HV004" />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Họ tên *</label>
                  <input className="form-control" value={form.hotenhv} onChange={(e) => handleChange('hotenhv', e.target.value)} />
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Ngày sinh</label>
                    <input type="date" className="form-control" value={form.ngaysinhhv} onChange={(e) => handleChange('ngaysinhhv', e.target.value)} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">Giới tính</label>
                    <select className="form-select" value={form.gioitinhhv} onChange={(e) => handleChange('gioitinhhv', e.target.value)}>
                      <option value="">-- Chọn --</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Lớp hiện tại *</label>
                  <select className="form-select" value={form.malop} onChange={(e) => handleChange('malop', e.target.value)}>
                    <option value="">-- Chọn lớp --</option>
                    {lopHocs.map((lop) => <option key={lop.maLop} value={lop.maLop}>{lop.maLop} - {lop.tenLop}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Số điện thoại</label>
                  <input className="form-control" value={form.dienthoaihv} onChange={(e) => handleChange('dienthoaihv', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Email</label>
                  <input type="email" className="form-control" value={form.emailhv} onChange={(e) => handleChange('emailhv', e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Địa chỉ</label>
                  <input className="form-control" value={form.diachinv} onChange={(e) => handleChange('diachinv', e.target.value)} />
                </div>
                <div className="mb-4">
                  <label className="form-label fw-semibold">Mật khẩu *</label>
                  <input className="form-control" value={form.matkhauhv} onChange={(e) => handleChange('matkhauhv', e.target.value)} />
                </div>
                <div className="d-flex gap-2">
                  <button className={`btn fw-bold text-white w-100 ${isEditing ? 'btn-warning' : 'btn-primary'}`} type="submit">
                    {isEditing ? 'Lưu cập nhật' : 'Thêm mới'}
                  </button>
                  {isEditing && <button type="button" className="btn btn-secondary fw-bold" onClick={resetForm}>Hủy</button>}
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white">
              <input className="form-control" placeholder="Tìm theo mã, tên, SĐT hoặc email..." value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            </div>
            <div className="card-body p-0 table-responsive">
              {loading ? <div className="text-center py-5"><div className="spinner-border text-primary"></div></div> : (
                <table className="table table-hover align-middle mb-0">
                  <thead className="table-dark">
                    <tr>
                      <th>Mã HV</th><th>Họ tên</th><th>Lớp</th><th>SĐT</th><th>Email</th><th className="text-center">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHocViens.map((hv) => (
                      <tr key={hv.mahv}>
                        <td className="fw-bold text-primary">{hv.mahv}</td>
                        <td>{hv.hotenhv}</td>
                        <td>{hv.malop}</td>
                        <td>{hv.dienthoaihv || '-'}</td>
                        <td>{hv.emailhv || '-'}</td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => handleEdit(hv)}>Sửa</button>
                          <button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(hv.mahv)}>Xóa</button>
                        </td>
                      </tr>
                    ))}
                    {filteredHocViens.length === 0 && <tr><td colSpan="6" className="text-center text-muted py-4">Chưa có dữ liệu học viên.</td></tr>}
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
