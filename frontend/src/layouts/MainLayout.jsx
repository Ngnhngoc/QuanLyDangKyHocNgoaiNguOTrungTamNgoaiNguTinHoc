import React from 'react';
// 1. QUAN TRỌNG: Phải import useLocation ở đây
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './HomePage';
import KhoaHocPage from './pages/KhoaHocPage';
import GiangVienPage from './pages/GiangVienPage';
import LichKhaiGiangPage from './pages/LichKhaiGiangPage';
import LoginPage from './pages/LoginPage';

// 2. Component AppLayout để xử lý logic ẩn/hiện
function AppLayout() {
  const location = useLocation();
  
  // Kiểm tra đường dẫn, dùng toLowerCase() cho chắc chắn
  console.log("Đường dẫn hiện tại là:", location.pathname);
  const isLoginPage = location.pathname.toLowerCase() === '/login'; 

  return (
    <>
      {/* Chỉ hiện Navbar nếu KHÔNG PHẢI trang login */}
      {!isLoginPage && <Navbar />}

      <div style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/khoahoc" element={<KhoaHocPage />} />
          <Route path="/giangvien" element={<GiangVienPage />} />
          <Route path="/lich" element={<LichKhaiGiangPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </div>

      {/* Chỉ hiện Footer nếu KHÔNG PHẢI trang login */}
      {!isLoginPage && <Footer />}
    </>
  );
}

// 3. Component chính
function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;