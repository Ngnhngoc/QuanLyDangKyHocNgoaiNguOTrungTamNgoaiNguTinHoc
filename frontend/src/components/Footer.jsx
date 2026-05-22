import React from 'react';

export default function Footer() {
  return (
    <footer className="w-100 py-4" style={{ backgroundColor: '#fcfaf6' }}>
      <div className="container-fluid p-0">
        <div className="row g-0 align-items-center">
          <div className="col-lg-4 col-md-12 px-5 py-4 text-start">
            <h4 className="fw-bold text-dark mb-3 text-uppercase" style={{ letterSpacing: '1px', fontSize: '1.2rem' }}>
              Thông tin liên hệ
            </h4>
            <div className="d-flex flex-column gap-2 text-dark" style={{ fontSize: '0.9rem' }}>
              <div><span className="fw-bold">Địa chỉ:</span> Trung tâm Ngoại ngữ - Tin học, Trường ĐH SPKT Vĩnh Long</div>
              <div><span className="fw-bold">Địa chỉ:</span> Số 73, Nguyễn Huệ, Phường 2, Tp. Vĩnh Long</div>
              <div><span className="fw-bold">Email:</span> flic@vlute.edu.vn</div>
            </div>
          </div>
          <div className="col-lg-8 col-md-12 p-0">
            <div style={{ height: '280px', width: '100%' }}>
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3926.241584347201!2d105.95922037466826!3d10.24209596879893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x310a82ce045c71a3%3A0xc3b832b85906802e!2zVHLGsOG7nW5nIMSQ4bqhaSBo4buNYyBTxrAgcGjhuqFtIEvhu7kgdGh14bqtdCBWxKluaCBMb25n!5e0!3m2!1svi!2s!4v1715427000000!5m2!1svi!2s" width="100%" height="100%" style={{ border: 0, display: 'block' }} allowFullScreen="" loading="lazy" title="map"></iframe>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}