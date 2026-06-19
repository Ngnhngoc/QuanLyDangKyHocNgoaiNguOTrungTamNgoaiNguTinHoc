import React from 'react';

export default function Footer() {
  return (
    <footer className="footer-modern w-100 pt-5">
      <div className="container pb-4">
        <div className="row g-4 align-items-start">
          <div className="col-lg-5 text-start">
            <div className="d-flex align-items-center gap-2 mb-3">
              <span className="brand-mark">🌐</span>
              <h4 className="fw-bold mb-0">LanguageForLife</h4>
            </div>
            <p className="mb-4" style={{ maxWidth: 520 }}>
              Hệ thống quản lý đăng ký học ngoại ngữ hỗ trợ học viên, giảng viên và trung tâm theo dõi thông tin đào tạo một cách thuận tiện.
            </p>
            <div className="d-flex flex-column gap-2 small">
              <div><span className="fw-bold text-white">Địa chỉ:</span> Trung tâm Ngoại ngữ - Tin học, Trường ĐH SPKT Vĩnh Long</div>
              <div><span className="fw-bold text-white">Cơ sở:</span> Số 73, Nguyễn Huệ, Phường 2, Tp. Vĩnh Long</div>
              <div><span className="fw-bold text-white">Email:</span> flic@vlute.edu.vn</div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="rounded-4 overflow-hidden shadow" style={{ height: 260 }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.241584347201!2d105.95922037466826!3d10.24209596879893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a82ce045c71a3%3A0xc3b832b85906802e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBWxKluaCBMb25n!5e0!3m2!1svi!2s!4v1715427000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" title="map"></iframe>
            </div>
          </div>
        </div>
      </div>
      <div className="border-top border-light border-opacity-10 py-3 text-center small text-white-50">
        © 2026 LanguageForLife - Hệ thống quản lý đăng ký học ngoại ngữ
      </div>
    </footer>
  );
}
