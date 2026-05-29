import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Import các Component cũ của em
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './HomePage';
import KhoaHocPage from './pages/KhoaHocPage';
import GiangVienPage from './pages/GiangVienPage';
import LichKhaiGiangPage from './pages/LichKhaiGiangPage';
import LoginPage from './pages/LoginPage';
import ThoiKhoaBieuPage from './pages/ThoiKhoaBieuPage'; // (Đường dẫn có thể thay đổi tùy cách em sắp xếp thư mục nhé)
import HocPhiPage from './pages/HocPhiPage'; // Đảm bảo đường dẫn tới file của em đã đúng

// === KHU VỰC IMPORT CỦA ADMIN (CHÚ Ý 3 DÒNG NÀY) ===
import AdminLayout from './pages/AdminLayout';
import AdminNgonNgu from './pages/AdminNgonNgu';
import AdminKhoaHoc from './pages/AdminKhoaHoc';
import AdminGiangVien from './pages/AdminGiangVien';
import AdminLopHoc from './pages/AdminLopHoc';
import AdminDuyetGhiDanh from './pages/AdminDuyetGhiDanh';

function AppContent() {
  const location = useLocation();
  
  // LOGIC ẨN NAVBAR/FOOTER:
  const isLoginPage = location.pathname.toLowerCase().includes('login');
  const isAdminPage = location.pathname.toLowerCase().startsWith('/admin');
  
  const hideNavFooter = isLoginPage || isAdminPage;

  return (
    <div className="App">
      {!hideNavFooter && <Navbar />}

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          {/* === NHÓM GIAO DIỆN HỌC VIÊN === */}
          <Route path="/" element={<HomePage />} />
          <Route path="/khoahoc" element={<KhoaHocPage />} />
          <Route path="/giangvien" element={<GiangVienPage />} />
          <Route path="/lich" element={<LichKhaiGiangPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/thoikhoabieu" element={<ThoiKhoaBieuPage />} />
          <Route path="/hocphi" element={<HocPhiPage />} />

          {/* === NHÓM GIAO DIỆN ADMIN === */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={
              <div className="text-center mt-5">
                <h2 className="fw-bold text-danger">TỔNG HÀNH DINH QUẢN TRỊ</h2>
                <p className="text-secondary">Hãy chọn một danh mục bên trái để bắt đầu làm việc.</p>
              </div>
            } />
            
            {/* 2 ĐƯỜNG DẪN NÀY ĐÃ ĐƯỢC MỞ KHÓA */}
            <Route path="ngon-ngu" element={<AdminNgonNgu />} />s
            <Route path="khoa-hoc" element={<AdminKhoaHoc />} />
            <Route path="giang-vien" element={<AdminGiangVien />} />
            <Route path="lop-hoc" element={<AdminLopHoc />} />
            <Route path="duyet-ghi-danh" element={<AdminDuyetGhiDanh />} />
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
      <AppContent />
    </Router>
  );
}