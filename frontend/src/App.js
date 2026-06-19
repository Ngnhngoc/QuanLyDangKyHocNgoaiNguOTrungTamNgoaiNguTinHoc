import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import HomePage from './HomePage';
import KhoaHocPage from './pages/KhoaHocPage';
import GiangVienPage from './pages/GiangVienPage';
import LichKhaiGiangPage from './pages/LichKhaiGiangPage';
import LoginPage from './pages/LoginPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import RegisterPage from './pages/RegisterPage';
import ThoiKhoaBieuPage from './pages/ThoiKhoaBieuPage';
import HocPhiPage from './pages/HocPhiPage';
import GiangVienDashboard from './pages/GiangVienDashboard';

import AdminLayout from './pages/AdminLayout';
import AdminNgonNgu from './pages/AdminNgonNgu';
import AdminKhoaHoc from './pages/AdminKhoaHoc';
import AdminGiangVien from './pages/AdminGiangVien';
import AdminLopHoc from './pages/AdminLopHoc';
import AdminDuyetGhiDanh from './pages/AdminDuyetGhiDanh';
import AdminHocPhi from './pages/AdminHocPhi';
import AdminHocVien from './pages/AdminHocVien';
import AdminNhanVien from './pages/AdminNhanVien';
import AdminDoanhThu from './pages/AdminDoanhThu';
import { AppNotificationProvider } from './components/AppNotification';
function AdminHome() {
  return (
    <div>
      <div className="text-start mb-4">
        <div className="section-kicker">
          Xin chào quản trị viên
        </div>

        <h2 className="fw-bold mb-2">
          Tổng quan hệ thống
        </h2>

        <p className="text-secondary mb-0">
          Chọn một chức năng ở thanh bên trái để quản lý dữ liệu trung tâm.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="admin-dashboard-card hover-card">
            <div className="fs-2 mb-2">
              📚
            </div>

            <h5 className="fw-bold">
              Khóa học & lớp học
            </h5>

            <p className="text-secondary mb-0">
              Quản lý khóa học, lớp học, lịch khai giảng và phân công giảng dạy.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-dashboard-card hover-card">
            <div className="fs-2 mb-2">
              👥
            </div>

            <h5 className="fw-bold">
              Học viên & giảng viên
            </h5>

            <p className="text-secondary mb-0">
              Theo dõi hồ sơ người học, giảng viên và nhân viên của trung tâm.
            </p>
          </div>
        </div>

        <div className="col-md-4">
          <div className="admin-dashboard-card hover-card">
            <div className="fs-2 mb-2">
              💳
            </div>

            <h5 className="fw-bold">
              Ghi danh & học phí
            </h5>

            <p className="text-secondary mb-0">
              Duyệt đăng ký học, kiểm tra học phí, lập phiếu thanh toán và thống kê doanh thu.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const location = useLocation();

  const currentPath = location.pathname.toLowerCase();

  const isLoginPage = currentPath.includes('login');
  const isAdminPage = currentPath.startsWith('/admin');

  const hideNavFooter = isLoginPage || isAdminPage;

  return (
    <div className="App">
      {!hideNavFooter && <Navbar />}

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* Giao diện học viên / trang công khai */}
          <Route path="/" element={<HomePage />} />
          <Route path="/khoahoc" element={<KhoaHocPage />} />
          <Route path="/giangvien" element={<GiangVienPage />} />
          <Route path="/lich" element={<LichKhaiGiangPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/doi-mat-khau" element={<ChangePasswordPage />} />

          <Route path="/thoikhoabieu" element={<ThoiKhoaBieuPage />} />
          <Route path="/hocphi" element={<HocPhiPage />} />

          {/* Giao diện giảng viên */}
          <Route path="/giang-vien/dashboard" element={<GiangVienDashboard />} />

          {/* Giao diện admin / nhân viên */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminHome />} />

            <Route path="ngon-ngu" element={<AdminNgonNgu />} />
            <Route path="khoa-hoc" element={<AdminKhoaHoc />} />
            <Route path="giang-vien" element={<AdminGiangVien />} />
            <Route path="hoc-vien" element={<AdminHocVien />} />
            <Route path="nhan-vien" element={<AdminNhanVien />} />
            <Route path="lop-hoc" element={<AdminLopHoc />} />
            <Route path="danh-sach-lop" element={<AdminLopHoc />} />
            <Route path="duyet-ghi-danh" element={<AdminDuyetGhiDanh />} />
            <Route path="hoc-phi" element={<AdminHocPhi />} />
            <Route path="doanh-thu" element={<AdminDoanhThu />} />
          </Route>
        </Routes>
      </main>

      {!hideNavFooter && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppNotificationProvider>
        <AppContent />
      </AppNotificationProvider>
    </Router>
  );
}