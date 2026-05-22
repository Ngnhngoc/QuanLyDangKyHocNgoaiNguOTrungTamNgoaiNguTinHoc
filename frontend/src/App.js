import React from 'react';
// DÒNG NÀY LÀ CỨU TINH CHO CÁI MÀN HÌNH ĐEN CỦA EM ĐÂY:
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './HomePage';
import KhoaHocPage from './pages/KhoaHocPage';
import GiangVienPage from './pages/GiangVienPage';
import LichKhaiGiangPage from './pages/LichKhaiGiangPage';
import LoginPage from './pages/LoginPage';

function AppContent() {
  // Đã có import ở trên nên đoạn này sẽ chạy mượt mà
  const location = useLocation();
  const isLoginPage = location.pathname.toLowerCase().includes('login');

  return (
    <div className="App">
      {/* 1. CHỈ HIỆN NAVBAR KHI KHÔNG PHẢI TRANG LOGIN */}
      {!isLoginPage && <Navbar />}

      <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/khoahoc" element={<KhoaHocPage />} />
          <Route path="/giangvien" element={<GiangVienPage />} />
          <Route path="/lich" element={<LichKhaiGiangPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </main>

      {/* 2. CHỈ HIỆN FOOTER KHI KHÔNG PHẢI TRANG LOGIN */}
      {!isLoginPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    // Đã có import Router ở trên nên thẻ này sẽ không báo lỗi nữa
    <Router>
      <AppContent />
    </Router>
  );
}