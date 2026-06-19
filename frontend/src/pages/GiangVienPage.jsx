import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { apiUrl } from '../services/api';

export default function GiangVienPage() {
  const [giangViens, setGiangViens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Gọi API lấy dữ liệu thực tế từ SQL
    fetch(apiUrl('/GiangVien'))
      .then(res => {
        if (!res.ok) throw new Error("API chưa sẵn sàng");
        return res.json();
      })
      .then(data => {
        setGiangViens(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Lỗi:", err.message);
        // Dữ liệu mẫu hỗ trợ hiển thị khi chưa có API
        setGiangViens([
          { maGV: 'GV01', tennv: 'Nguyễn Như Ngọc', chuyenmon: 'Tiếng Anh', sdtnv: '0901.234.567', emailnv: 'ngoc.nn@tuv.edu.vn', hinhanh: null },
          { maGV: 'GV02', tennv: 'Đặng Thị Thu Sương', chuyenmon: 'Tiếng Hàn', sdtnv: '0987.654.321', emailnv: 'suong.dtt@tuv.edu.vn', hinhanh: null },
          { maGV: 'GV03', tennv: 'Hoàng Duy Thiện Nguyên', chuyenmon: 'Tiếng Nhật', sdtnv: '0911.222.333', emailnv: 'nguyen.hdt@tuv.edu.vn', hinhanh: null },
          { maGV: 'GV04', tennv: 'Trần Kim Tài', chuyenmon: 'Tiếng Trung', sdtnv: '0944.555.666', emailnv: 'tai.tk@tuv.edu.vn', hinhanh: null }
        ]);
        setLoading(false);
      });
  }, []);

  const getAvatarUrl = (name, imageUrl) => {
    if (imageUrl && imageUrl.trim() !== "") return imageUrl;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=150&bold=true`;
  };

  return (
    <div className="bg-light min-vh-100 pb-5" style={{ fontFamily: "'Roboto', sans-serif" }}>
      
      <div className="py-5 text-center shadow-sm mb-5" style={{ backgroundColor: '#1a568c', color: 'white' }}>
        <div className="container py-3">
          <h1 className="fw-bold">Đội Ngũ Giảng Viên Chuyên Nghiệp</h1>
          <p className="lead mt-3 w-75 mx-auto opacity-75">
            TVU Language Center tự hào mang đến đội ngũ giảng viên tận tâm, 
            giàu kinh nghiệm và luôn áp dụng các phương pháp giảng dạy hiện đại.
          </p>
        </div>
      </div>

      <div className="container">
        {loading ? (
          <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {giangViens.map((gv, index) => {
              const ten = gv.tennv || gv.Tennv || gv.tenGV || "Chưa có tên";
              const ngonNgu = gv.chuyenmon || gv.Chuyenmon || gv.chuyenMon || "Đang cập nhật";
              const sdt = gv.sdtnv || gv.Sdtnv || gv.sdt || "Chưa cập nhật";
              const email = gv.emailnv || gv.Emailnv || "Đang cập nhật...";
              const anh = gv.hinhanh || gv.Hinhanh || null;

              return (
                <div className="col" key={index}>
                  <div className="card h-100 shadow-sm border rounded-4 text-center p-3 hover-card" 
                       style={{ transition: 'all 0.3s ease', borderColor: '#eaeaea' }}>
                    <div className="card-body d-flex flex-column align-items-center">
                      
                      <img 
                        src={getAvatarUrl(ten, anh)} 
                        alt={ten} 
                        className="rounded-circle mb-3 shadow-sm border border-4 border-white"
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                      />
                      
                      <h5 className="card-title fw-bold text-dark mb-2" style={{ fontSize: '1.1rem' }}>
                        {ten}
                      </h5>

                      {/* Hiển thị Chuyên môn là Ngôn ngữ giảng dạy - KHÔNG CÒN NÚT CHI TIẾT */}
                      <div className="mb-3">
                        <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill px-3 py-2" 
                              style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                          🌐 Giảng dạy: {ngonNgu}
                        </span>
                      </div>
                      
                      <hr className="w-100 text-muted opacity-25 my-0 mb-3" />
                      
                      <div className="w-100 text-start text-secondary mt-auto" style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
                        <p className="mb-1 d-flex align-items-center">
                          <span className="me-2">📱</span> {sdt}
                        </p>
                        <p className="mb-0 d-flex align-items-center">
                          <span className="me-2">✉️</span> 
                          <a href={`mailto:${email}`} className="text-decoration-none text-secondary hover-primary">
                            {email}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
          border-color: #0d6efd !important;
        }
        .hover-primary:hover {
          color: #0d6efd !important;
          text-decoration: underline !important;
        }
      `}</style>
    </div>
  );
}
