import React, { useEffect, useMemo, useState } from 'react';
import { apiUrl } from '../services/api';

export default function AdminNhanVien() {
  const [nhanViens, setNhanViens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    manv2: '', tennv: '', ngaysinhhv: '', gioitinhhv: '', sdtnv: '', diachinv: '', matkhaunv: ''
  });

  const normalizeDate = (value) => {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10);
  };

  const fetchNhanVien = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl('/Nhanvien'));
      if (!res.ok) throw new Error('Không tải được danh sách nhân viên');
      setNhanViens(await res.json());
    } catch (error) {
      console.error(error);
      alert('Không kết nối được API nhân viên.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNhanVien(); }, []);

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return nhanViens;
    return nhanViens.filter((nv) => `${nv.manv2} ${nv.tennv} ${nv.sdtnv} ${nv.diachinv}`.toLowerCase().includes(q));
  }, [nhanViens, keyword]);

  const handleChange = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const resetForm = () => {
    setForm({ manv2: '', tennv: '', ngaysinhhv: '', gioitinhhv: '', sdtnv: '', diachinv: '', matkhaunv: '' });
    setIsEditing(false);
  };

  const handleEdit = (nv) => {
    setForm({
      manv2: nv.manv2 || '',
      tennv: nv.tennv || '',
      ngaysinhhv: normalizeDate(nv.ngaysinhhv),
      gioitinhhv: nv.gioitinhhv || '',
      sdtnv: nv.sdtnv || '',
      diachinv: nv.diachinv || '',
      matkhaunv: nv.matkhaunv || ''
    });
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.manv2 || !form.tennv || !form.matkhaunv) {
      alert('Vui lòng nhập mã nhân viên, họ tên và mật khẩu.');
      return;
    }

    const payload = {
      manv2: form.manv2.trim(),
      tennv: form.tennv.trim(),
      ngaysinhhv: form.ngaysinhhv ? new Date(form.ngaysinhhv).toISOString() : null,
      gioitinhhv: form.gioitinhhv || null,
      sdtnv: form.sdtnv || null,
      diachinv: form.diachinv || null,
      matkhaunv: form.matkhaunv || null
    };

    const url = isEditing ? apiUrl(`/Nhanvien/${payload.manv2}`) : apiUrl('/Nhanvien');
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (res.ok) {
        alert(isEditing ? 'Cập nhật nhân viên thành công!' : 'Thêm nhân viên thành công!');
        resetForm();
        fetchNhanVien();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Thao tác thất bại.');
      }
    } catch (error) {
      alert('Không kết nối được máy chủ.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm(`Bạn có chắc muốn xóa nhân viên [${id}] không?`)) return;
    try {
      const res = await fetch(apiUrl(`/Nhanvien/${id}`), { method: 'DELETE' });
      if (res.ok) {
        alert('Xóa nhân viên thành công!');
        fetchNhanVien();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.message || 'Không thể xóa nhân viên này.');
      }
    } catch (error) {
      alert('Không kết nối được máy chủ.');
    }
  };

  return (
    <div className="container-fluid py-2">
      <div className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-4 flex-wrap gap-3">
        <div>
          <h3 className="fw-bold text-dark mb-1">👩‍💼 QUẢN LÝ NHÂN VIÊN</h3>
          <p className="text-secondary mb-0">Quản lý tài khoản và hồ sơ nhân viên trung tâm.</p>
        </div>
        <button className="btn btn-primary fw-bold" onClick={fetchNhanVien}>Tải lại</button>
      </div>
      <div className="row">
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 rounded-3">
            <div className={`card-header fw-bold ${isEditing ? 'bg-warning text-dark' : 'bg-danger text-white'}`}>{isEditing ? '✏️ Cập nhật nhân viên' : '➕ Thêm nhân viên'}</div>
            <div className="card-body bg-light">
              <form onSubmit={handleSubmit}>
                <div className="mb-3"><label className="form-label fw-semibold">Mã nhân viên *</label><input className="form-control" value={form.manv2} disabled={isEditing} onChange={(e) => handleChange('manv2', e.target.value)} placeholder="VD: NV003" /></div>
                <div className="mb-3"><label className="form-label fw-semibold">Họ tên *</label><input className="form-control" value={form.tennv} onChange={(e) => handleChange('tennv', e.target.value)} /></div>
                <div className="row">
                  <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Ngày sinh</label><input type="date" className="form-control" value={form.ngaysinhhv} onChange={(e) => handleChange('ngaysinhhv', e.target.value)} /></div>
                  <div className="col-md-6 mb-3"><label className="form-label fw-semibold">Giới tính</label><select className="form-select" value={form.gioitinhhv} onChange={(e) => handleChange('gioitinhhv', e.target.value)}><option value="">-- Chọn --</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option></select></div>
                </div>
                <div className="mb-3"><label className="form-label fw-semibold">Số điện thoại</label><input className="form-control" value={form.sdtnv} onChange={(e) => handleChange('sdtnv', e.target.value)} /></div>
                <div className="mb-3"><label className="form-label fw-semibold">Địa chỉ</label><input className="form-control" value={form.diachinv} onChange={(e) => handleChange('diachinv', e.target.value)} /></div>
                <div className="mb-4"><label className="form-label fw-semibold">Mật khẩu *</label><input className="form-control" value={form.matkhaunv} onChange={(e) => handleChange('matkhaunv', e.target.value)} /></div>
                <div className="d-flex gap-2"><button className={`btn fw-bold text-white w-100 ${isEditing ? 'btn-warning' : 'btn-danger'}`} type="submit">{isEditing ? 'Lưu cập nhật' : 'Thêm mới'}</button>{isEditing && <button type="button" className="btn btn-secondary fw-bold" onClick={resetForm}>Hủy</button>}</div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white"><input className="form-control" placeholder="Tìm theo mã, tên, SĐT hoặc địa chỉ..." value={keyword} onChange={(e) => setKeyword(e.target.value)} /></div>
            <div className="card-body p-0 table-responsive">
              {loading ? <div className="text-center py-5"><div className="spinner-border text-danger"></div></div> : (
                <table className="table table-hover align-middle mb-0"><thead className="table-dark"><tr><th>Mã NV</th><th>Họ tên</th><th>SĐT</th><th>Địa chỉ</th><th className="text-center">Thao tác</th></tr></thead><tbody>
                  {filtered.map((nv) => <tr key={nv.manv2}><td className="fw-bold text-danger">{nv.manv2}</td><td>{nv.tennv}</td><td>{nv.sdtnv || '-'}</td><td>{nv.diachinv || '-'}</td><td className="text-center"><button className="btn btn-sm btn-outline-primary rounded-pill px-3 me-2" onClick={() => handleEdit(nv)}>Sửa</button><button className="btn btn-sm btn-outline-danger rounded-pill px-3" onClick={() => handleDelete(nv.manv2)}>Xóa</button></td></tr>)}
                  {filtered.length === 0 && <tr><td colSpan="5" className="text-center text-muted py-4">Chưa có dữ liệu nhân viên.</td></tr>}
                </tbody></table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
