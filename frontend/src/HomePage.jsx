import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

export default function HomePage() {
  const navigate = useNavigate();
  const [danhMucNN, setDanhMucNN] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5052/api/DanhMucNN')
      .then((res) => res.json())
      .then((data) => setDanhMucNN(Array.isArray(data) ? data : []))
      .catch((err) => console.error('Lỗi gọi API Danh mục:', err));
  }, []);

  const getLanguageDetails = (ma) => {
    const maChuan = (ma || '').toString().trim().toUpperCase();

    const detailsMap = {
      TA: {
        flag: 'gb',
        shortName: 'Tiếng Anh',
        desc: 'Luyện thi IELTS, TOEIC và giao tiếp tiếng Anh trong học tập, công việc.',
        color: 'primary',
      },
      TH: {
        flag: 'kr',
        shortName: 'Tiếng Hàn',
        desc: 'Chinh phục TOPIK, giao tiếp cơ bản và tìm hiểu văn hóa Hàn Quốc.',
        color: 'danger',
      },
      TT: {
        flag: 'cn',
        shortName: 'Tiếng Trung',
        desc: 'Luyện thi HSK, tiếng Trung giao tiếp và tiếng Trung thương mại.',
        color: 'danger',
      },
      TD: {
        flag: 'de',
        shortName: 'Tiếng Đức',
        desc: 'Học tiếng Đức giao tiếp, luyện chứng chỉ và chuẩn bị du học.',
        color: 'warning',
      },
      TN: {
        flag: 'jp',
        shortName: 'Tiếng Nhật',
        desc: 'Luyện thi JLPT, giao tiếp tiếng Nhật và mở rộng cơ hội làm việc.',
        color: 'info',
      },
      TP: {
        flag: 'fr',
        shortName: 'Tiếng Pháp',
        desc: 'Chuẩn bị chứng chỉ DELF/DALF và giao tiếp tiếng Pháp cơ bản.',
        color: 'primary',
      },
      TS: {
        flag: 'es',
        shortName: 'Tiếng Tây Ban Nha',
        desc: 'Học tiếng Tây Ban Nha phục vụ giao tiếp, học tập và giao thương.',
        color: 'warning',
      },
      TR: {
        flag: 'ru',
        shortName: 'Tiếng Nga',
        desc: 'Học tiếng Nga giao tiếp và chuẩn bị nền tảng du học.',
        color: 'secondary',
      },
    };

    return (
      detailsMap[maChuan] || {
        flag: 'un',
        shortName: 'Ngoại ngữ',
        desc: 'Chương trình đào tạo ngôn ngữ chất lượng cao, phù hợp với nhiều nhu cầu học tập.',
        color: 'secondary',
      }
    );
  };

  return (
    <div className="home-page">
      {/* SLIDER ẢNH TỰ ĐỘNG CHẠY */}
      <section className="home-carousel-section">
        <div
          id="heroCarousel"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3500"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>

            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>

            <button
              type="button"
              data-bs-target="#heroCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                className="d-block w-100 home-carousel-img"
                alt="Lớp học ngoại ngữ"
              />

              <div className="home-carousel-overlay"></div>

              <div className="carousel-caption home-carousel-caption">
                <span className="home-badge">Trung tâm Ngoại ngữ - Tin học</span>

                <h1>Đăng ký học ngoại ngữ nhanh chóng</h1>

                <p>
                  Học viên dễ dàng xem khóa học, lịch khai giảng và đăng ký lớp học phù hợp
                  ngay trên hệ thống.
                </p>

                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  <button
                    className="btn btn-primary px-4 py-2 fw-bold"
                    onClick={() => navigate('/khoahoc')}
                  >
                    Xem khóa học
                  </button>

                  <button
                    className="btn btn-light px-4 py-2 fw-bold"
                    onClick={() => navigate('/login')}
                  >
                    Đăng nhập
                  </button>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                className="d-block w-100 home-carousel-img"
                alt="Môi trường học tập hiện đại"
              />

              <div className="home-carousel-overlay"></div>

              <div className="carousel-caption home-carousel-caption">
                <span className="home-badge">Học tập hiện đại</span>

                <h1>Môi trường học tập chuyên nghiệp</h1>

                <p>
                  Trung tâm hỗ trợ quản lý lớp học, giảng viên, học viên và lịch học
                  một cách rõ ràng, tập trung.
                </p>

                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  <button
                    className="btn btn-primary px-4 py-2 fw-bold"
                    onClick={() => navigate('/lichkhaigiang')}
                  >
                    Xem lịch khai giảng
                  </button>

                  <button
                    className="btn btn-light px-4 py-2 fw-bold"
                    onClick={() => navigate('/giangvien')}
                  >
                    Xem giảng viên
                  </button>
                </div>
              </div>
            </div>

            <div className="carousel-item">
              <img
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                className="d-block w-100 home-carousel-img"
                alt="Sinh viên học nhóm"
              />

              <div className="home-carousel-overlay"></div>

              <div className="carousel-caption home-carousel-caption">
                <span className="home-badge">Quản lý đào tạo</span>

                <h1>Quản lý đăng ký học trên một hệ thống</h1>

                <p>
                  Hỗ trợ học viên, giảng viên và quản trị viên sử dụng chung một cổng đăng nhập,
                  sau đó tự động chuyển đến đúng giao diện.
                </p>

                <div className="d-flex gap-3 flex-wrap justify-content-center">
                  <button
                    className="btn btn-primary px-4 py-2 fw-bold"
                    onClick={() => navigate('/login')}
                  >
                    Đăng nhập hệ thống
                  </button>

                  <button
                    className="btn btn-light px-4 py-2 fw-bold"
                    onClick={() => navigate('/dang-ky')}
                  >
                    Đăng ký tài khoản
                  </button>
                </div>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Trước</span>
          </button>

          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#heroCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Sau</span>
          </button>
        </div>
      </section>

      {/* GIỚI THIỆU */}
      {/* GIỚI THIỆU */}
<section className="container py-5">
  <div className="home-about-box">
    <div className="row align-items-center g-5">
      <div className="col-lg-6">
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=900&q=80"
          alt="Học viên học ngoại ngữ"
          className="img-fluid home-about-img"
        />
      </div>

      <div className="col-lg-6">
        <div className="text-start">
          <span className="section-kicker">Về trung tâm</span>

          <h2 className="display-6 fw-bold mb-4">
            Học ngoại ngữ thuận tiện hơn với hệ thống đăng ký trực tuyến
          </h2>

          <p className="text-secondary fs-5 mb-4">
            Trung tâm Ngoại ngữ - Tin học cung cấp nhiều chương trình đào tạo phù hợp
            với nhu cầu học tập, giao tiếp, thi chứng chỉ và phát triển nghề nghiệp.
            Hệ thống giúp học viên dễ dàng tra cứu khóa học, lịch khai giảng và đăng ký lớp học.
          </p>

          <div className="home-about-list">
            <div className="home-about-item">
              <span>✓</span>
              <p>Tra cứu nhanh các khóa học đang mở và lịch khai giảng mới nhất.</p>
            </div>

            <div className="home-about-item">
              <span>✓</span>
              <p>Đăng ký học trực tuyến, hạn chế thao tác thủ công tại trung tâm.</p>
            </div>

            <div className="home-about-item">
              <span>✓</span>
              <p>Theo dõi thông tin lớp học, giảng viên, thời khóa biểu và học phí rõ ràng.</p>
            </div>
          </div>

          <div className="d-flex gap-3 flex-wrap mt-4">
            <button
              className="btn btn-primary px-5 py-3 fw-bold"
              onClick={() => navigate('/khoahoc')}
            >
              Xem khóa học
            </button>

            <button
              className="btn btn-outline-primary px-5 py-3 fw-bold"
              onClick={() => navigate('/lichkhaigiang')}
            >
              Lịch khai giảng
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* TÍNH NĂNG */}
      <section className="container pb-5">
        <div className="text-center mb-5">
          <span className="section-kicker">Tính năng nổi bật</span>

          <h2 className="section-title display-6">
            Hỗ trợ đầy đủ quy trình đăng ký học
          </h2>

          <p className="text-secondary mx-auto" style={{ maxWidth: 720 }}>
            Các chức năng được thiết kế xoay quanh nghiệp vụ đăng ký học ngoại ngữ,
            giúp giảm thao tác thủ công và hỗ trợ quản lý dữ liệu tập trung.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="home-feature-card">
              <div className="home-feature-icon">📝</div>
              <h5>Đăng ký học trực tuyến</h5>
              <p>
                Học viên xem lớp đang mở, chọn lớp phù hợp và gửi thông tin đăng ký.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="home-feature-card">
              <div className="home-feature-icon">👨‍🏫</div>
              <h5>Quản lý lớp học</h5>
              <p>
                Quản lý khóa học, lớp học, giảng viên, phân công giảng dạy và sĩ số lớp.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="home-feature-card">
              <div className="home-feature-icon">💳</div>
              <h5>Theo dõi học phí</h5>
              <p>
                Theo dõi tình trạng thanh toán, công nợ và phiếu học phí của học viên.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DANH MỤC NGÔN NGỮ */}
      <section className="container pb-5" id="khoahoc">
        <div className="d-flex justify-content-between align-items-end mb-4 flex-wrap gap-3">
          <div className="text-start">
            <span className="section-kicker">Chương trình đào tạo</span>

            <h2 className="section-title mb-0">
              Danh mục ngôn ngữ
            </h2>
          </div>

          <Link to="/khoahoc" className="btn btn-outline-primary px-4 fw-bold">
            Xem tất cả khóa học
          </Link>
        </div>

        <div className="row g-4">
          {danhMucNN.length === 0 && (
            <div className="col-12">
              <div className="alert alert-light border rounded-4 shadow-sm text-secondary">
                Chưa tải được danh mục ngôn ngữ. Vui lòng kiểm tra API hoặc dữ liệu SQL Server.
              </div>
            </div>
          )}

          {danhMucNN.map((lang, index) => {
            const maChuan = (lang.maDanhMuc || '').toString().trim().toUpperCase();
            const tenChuan = lang.tenDanhMuc || 'Chưa có tên';
            const details = getLanguageDetails(maChuan);

            return (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="home-language-card">
                  <div className="home-language-head">
                    <div className="home-language-flag">
                      <img
                        src={`https://flagcdn.com/w80/${details.flag}.png`}
                        alt={`Cờ ${tenChuan}`}
                      />
                    </div>

                    <span className={`home-language-code bg-${details.color}`}>
                      {maChuan}
                    </span>
                  </div>

                  <h5>{tenChuan}</h5>

                  <p>{details.desc}</p>

                  <button
                    className="btn btn-primary w-100 fw-bold"
                    onClick={() => navigate('/khoahoc')}
                  >
                    Xem khóa học
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}