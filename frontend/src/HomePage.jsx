import React, { useState, useEffect } from 'react'; // Bắt buộc phải có useState, useEffect
import { useNavigate } from 'react-router-dom'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import GiangVienPage from './pages/GiangVienPage';

export default function HomePage() {
  const navigate = useNavigate();

  // ==========================================
  // PHẦN 1: KHAI BÁO BIẾN VÀ GỌI API (Phần em bị thiếu)
  // ==========================================
  const [danhMucNN, setDanhMucNN] = useState([]);

  useEffect(() => {
    // Gọi API để hút dữ liệu từ SQL lên
    fetch('http://localhost:5052/api/DanhMucNN')
      .then(res => res.json())
      .then(data => setDanhMucNN(data))
      .catch(err => console.error("Lỗi gọi API Danh mục:", err));
  }, []);

  const getLanguageDetails = (ma) => {
    const detailsMap = {
      'TA': { flag: 'gb', desc: 'Luyện thi IELTS, TOEIC và giao tiếp chuẩn quốc tế với giáo viên bản xứ.', color: 'primary' },
      'TH': { flag: 'kr', desc: 'Chinh phục TOPIK, tiếng Hàn giao tiếp và văn hóa doanh nghiệp Hàn Quốc.', color: 'danger' },
      'TT': { flag: 'cn', desc: 'Luyện thi HSK các cấp, tiếng Trung thương mại ứng dụng thực tế.', color: 'danger' },
      'TD': { flag: 'de', desc: 'Hành trang du học, chứng chỉ Goethe-Zertifikat và định cư tại Đức.', color: 'warning text-dark' },
      'TN': { flag: 'jp', desc: 'Đạt chuẩn JLPT, mở rộng cơ hội làm việc tại các doanh nghiệp Nhật Bản.', color: 'info' },
      'TP': { flag: 'fr', desc: 'Khám phá ngôn ngữ lãng mạn, chuẩn bị thi chứng chỉ DELF/DALF.', color: 'primary' },
      'TS': { flag: 'es', desc: 'Ngôn ngữ phổ biến thứ 2 toàn cầu, mở rộng cơ hội giao thương.', color: 'warning text-dark' },
      'TR': { flag: 'ru', desc: 'Chương trình giao tiếp, hành trang săn học bổng du học tại Nga.', color: 'secondary' }
    };
    return detailsMap[ma] || { flag: 'un', desc: 'Chương trình đào tạo ngôn ngữ chất lượng cao.', color: 'secondary' };
  };

  // ==========================================
  // PHẦN 2: GIAO DIỆN (Code của em)
  // ==========================================
  return (
    <div style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* --- SLIDER HÌNH ẢNH CHẠY (CAROUSEL) --- */}
      <div id="heroCarousel" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>

        <div className="carousel-inner">
          {/* Ảnh 1 */}
          <div className="carousel-item active" data-bs-interval="3000">
            <img 
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              className="d-block w-100" 
              alt="Slide 1" 
              style={{ height: '500px', objectFit: 'cover' }} 
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3 mb-4">
              <h2 className="fw-bold text-white">Ghi Danh Học, Thi Cấp Chứng Chỉ</h2>
              <p className="fs-5 text-light">Mở rộng cơ hội nghề nghiệp với các chứng chỉ ngoại ngữ quốc tế.</p>
            </div>
          </div>

          {/* Ảnh 2 */}
          <div className="carousel-item" data-bs-interval="3000">
            <img 
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              className="d-block w-100" 
              alt="Slide 2" 
              style={{ height: '500px', objectFit: 'cover' }} 
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3 mb-4">
              <h2 className="fw-bold text-white">Môi Trường Học Tập Hiện Đại</h2>
              <p className="fs-5 text-light">Trang thiết bị tiên tiến, đội ngũ giảng viên giàu kinh nghiệm thực tế.</p>
            </div>
          </div>

          {/* Ảnh 3 */}
          <div className="carousel-item" data-bs-interval="3000">
            <img 
              src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              className="d-block w-100" 
              alt="Slide 3" 
              style={{ height: '500px', objectFit: 'cover' }} 
            />
            <div className="carousel-caption d-none d-md-block bg-dark bg-opacity-50 rounded-3 p-3 mb-4">
              <h2 className="fw-bold text-white">Chương Trình Đào Tạo Đa Dạng</h2>
              <p className="fs-5 text-light">Đáp ứng mọi nhu cầu từ giao tiếp cơ bản đến chuyên ngành chuyên sâu.</p>
            </div>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true" style={{ width: '3rem', height: '3rem' }}></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true" style={{ width: '3rem', height: '3rem' }}></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>

      {/* --- HERO SECTION --- */}
      <div className="container mt-5">
        <div className="row align-items-center">
          <div className="col-md-6 position-relative">
            <h1 className="display-3 fw-bold text-dark mb-4" style={{ zIndex: 2, position: 'relative' }}>
              Giới thiệu
            </h1>
            <p className="fs-5 text-muted">
              Hệ thống quản lý trung tâm ngoại ngữ hàng đầu, giúp bạn dễ dàng theo dõi lịch học, đăng ký khóa học và kết nối với giảng viên chuyên nghiệp.
            </p>
            <button className="btn btn-success rounded-pill px-5 py-3 mt-3 fw-bold fs-5 shadow">
              Khám Phá Ngay
            </button>
          </div>

          <div className="col-md-6 text-center">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Học viên vui vẻ" 
              className="img-fluid rounded-5 shadow-lg"
              style={{ borderBottomLeftRadius: '100px' }}
            />
          </div>
        </div>

      {/* --- CHƯƠNG TRÌNH ĐÀO TẠO (DỮ LIỆU THẬT) --- */}
      <div className="container mt-5 pt-5 mb-5" id="khoahoc">
        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
          <h2 className="fw-bold" style={{ color: '#1a568c' }}>Chương trình đào tạo</h2>
          <button className="btn btn-outline-secondary px-4">Xem thêm</button>
        </div>

        <div className="row g-4">
          {danhMucNN.map((lang, index) => {
            // Lấy CHÍNH XÁC tên biến từ Swagger (maDanhMuc và tenDanhMuc)
            const maChuan = (lang.maDanhMuc || "").toString().trim();
            const tenChuan = lang.tenDanhMuc || "Chưa có tên";

            const details = getLanguageDetails(maChuan); 
            
            return (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="card h-100 shadow-sm border rounded-4 hover-card d-flex flex-column" 
                     style={{ transition: 'transform 0.3s ease', borderColor: '#eaeaea' }}>
                  <div className="card-body p-4 text-center d-flex flex-column align-items-center">
                    
                    <img 
                      src={`https://flagcdn.com/w80/${details.flag}.png`} 
                      alt={`Cờ ${tenChuan}`} 
                      className="mb-3 shadow-sm" 
                      style={{ width: '64px', borderRadius: '4px', objectFit: 'cover' }}
                    />
                    
                    {/* Tên ngôn ngữ */}
                    <h5 className="card-title fw-bold text-dark mb-3">{tenChuan}</h5>
                    
                    <hr className="w-100 text-muted opacity-25 my-0 mb-3" />
                    
                    <p className="card-text text-secondary flex-grow-1" style={{ fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {details.desc}
                    </p>
                    
                    <button className={`btn btn-outline-${details.color} rounded-pill mt-3 px-4 fw-semibold w-100`}>
                      Chi tiết
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}