import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Thêm cái này để chuyển trang
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LichKhaiGiangPage() {
  const [lichHoc, setLichHoc] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterKhoaHoc, setFilterKhoaHoc] = useState("all");
  const navigate = useNavigate(); // 2. Khởi tạo điều hướng

  useEffect(() => {
    fetch('http://localhost:5052/api/LopHoc')
      .then(res => {
        if (!res.ok) throw new Error("API chưa sẵn sàng");
        return res.json();
      })
      .then(data => {
        setLichHoc(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err.message);
        setLoading(false);
      });
  }, []);

  // 3. HÀM XỬ LÝ GHI DANH KHI BẤM NÚT
  const handleGhiDanh = async (maLop) => {
    // 1. Log ra xem có nhận được mã lớp không
    console.log("👉 Đã bấm nút! Mã lớp nhận được là:", maLop);

    const userString = localStorage.getItem('user');
    console.log("👉 Dữ liệu user trong máy:", userString);

    if (!userString) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const user = JSON.parse(userString);

    try {
      // Xóa chữ /GhiDanh đi nhé
      const response = await fetch('http://localhost:5052/api/DangKy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
  mahv: user.mahv, 
  malop: maLop 
}),
      });

      const data = await response.json();

      if (response.ok) {
        alert("🎉 " + data.message);
        navigate('/hocphi'); 
      } else {
        // 👉 Đề phòng data.message không tồn tại thì lấy data.title
        alert("⚠️ " + (data.message || data.title || "Lỗi không xác định từ Server!"));
      }
    } catch (error) {
      console.error("Lỗi:", error);
      alert("Không thể kết nối đến máy chủ Backend!");
    }
  };

  const filteredLichHoc = filterKhoaHoc === "all" 
    ? lichHoc 
    : lichHoc.filter(lop => (lop.tenKhoaHoc || "").toLowerCase().includes(filterKhoaHoc.toLowerCase()));

  return (
    <div className="bg-white min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      <div className="container py-5">
        <h2 className="fw-bold mb-3" style={{ color: '#333' }}>Lịch học của LanguageForLife theo khóa học</h2>
        <p className="text-secondary mb-4">
          Tất cả các khóa học tại trung tâm đều được đảm bảo đầu ra. 
          <strong className="text-dark"> Đăng ký càng sớm ưu đãi càng cao</strong>, 
          nhanh tay chọn cơ sở gần nhất và đăng ký lớp phù hợp trình độ nào!
        </p>

        <div className="d-flex justify-content-end mb-3">
          <select 
            className="form-select w-auto bg-light border-0 shadow-sm" 
            value={filterKhoaHoc} 
            onChange={(e) => setFilterKhoaHoc(e.target.value)}
            style={{ color: '#dc3545', fontWeight: '500' }}
          >
            <option value="all">Lựa chọn khóa học</option>
            <option value="ielts">Tiếng Anh</option>
            <option value="topik">Tiếng Hàn</option>
            <option value="tiếng trung">Tiếng Trung</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-danger"></div></div>
        ) : (
          <div className="table-responsive shadow-sm rounded-4 border">
            <table className="table table-hover align-middle mb-0 text-center">
              <thead style={{ backgroundColor: '#f5f5f5', color: '#555' }}>
                <tr>
                  <th className="py-3 text-start ps-4" style={{ width: '30%' }}>Khóa học / Cơ sở</th>
                  <th className="py-3">Số lượng học viên</th>
                  <th className="py-3">Khai giảng</th>
                  <th className="py-3">Buổi học</th>
                  <th className="py-3">Giờ học</th>
                  <th className="py-3">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredLichHoc.map((lop, index) => {
                  const ten = lop.tenKhoaHoc || "Đang cập nhật";
                  const daGhiDanh = lop.daGhiDanh ?? 0;
                  const tongCho = lop.tongCho ?? 0;
                  const ngayKG = lop.ngayKhaiGiang || "Chưa xếp lịch";
                  const buoi = lop.buoiHoc || "Chưa xếp";
                  const gio = lop.gioHoc || "Chưa xếp";
                  const tinhTrang = lop.tinhTrang || "Đang tuyển";
                  // Đổi lop.malop thành lop.maLop 
                  const maLop = lop.maLop;

                  return (
                    <tr key={index}>
                      <td className="py-4 text-start ps-4 fw-medium text-secondary">
                        {ten}
                      </td>
                      <td className="py-4 text-center">
                        <div className="fw-bold text-dark">{daGhiDanh}/{tongCho}</div>
                        <span className={`badge rounded-pill mt-1 ${tinhTrang === 'Gần hết chỗ' ? 'bg-warning text-dark bg-opacity-25' : 'bg-success text-success bg-opacity-25'}`} style={{fontSize: '0.7rem'}}>
                          {tinhTrang}
                        </span>
                      </td>
                      <td className="py-4 text-secondary text-center">{ngayKG}</td>
                      <td className="py-4 text-secondary text-center">{buoi}</td>
                      <td className="py-4 text-secondary text-center">{gio}</td>
                      <td className="py-4 text-center">
                        {/* 5. GẮN SỰ KIỆN CLICK VÀO ĐÂY */}
                        <button 
                          className="btn btn-danger rounded-pill px-4 fw-bold shadow-sm btn-sm"
                          onClick={() => handleGhiDanh(maLop)}
                        >
                          Ghi danh
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style>{`
        .table thead th { border-bottom: none; }
        .table tbody tr { border-bottom: 1px solid #eaeaea; }
        .table tbody tr:last-child { border-bottom: none; }
        .btn-danger { background-color: #ef4444; border-color: #ef4444; }
        .btn-danger:hover { background-color: #dc2626; border-color: #dc2626; transform: translateY(-2px); transition: 0.2s; }
      `}</style>
    </div>
  );
}