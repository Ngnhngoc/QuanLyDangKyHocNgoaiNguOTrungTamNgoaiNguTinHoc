import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GiangVienPage from './GiangVienPage'; // Sửa lại đường dẫn './' nếu em để trong thư mục khác như './pages/GiangVienPage'

export default function KhoaHocPage() {
  const navigate = useNavigate();

  // 1. CÁC STATE LƯU TRỮ DỮ LIỆU
  const [courses, setCourses] = useState([]); 
  const [categories, setCategories] = useState([]); // Chứa danh mục từ API riêng

  // 2. CÁC STATE ĐỂ LỌC (FILTER)
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');

  // 3. GỌI CÙNG LÚC 2 API KHI TRANG VỪA MỞ LÊN
  useEffect(() => {
    // API 1: Lấy danh sách khóa học
    fetch('http://localhost:5052/api/khoahoc')
      .then(res => {
        if (!res.ok) throw new Error('API Khóa học chưa sẵn sàng');
        return res.json();
      })
      .then(data => setCourses(data))
      .catch(err => console.error("Lỗi Khóa học:", err));

    // API 2: Lấy TẤT CẢ danh mục để làm Dropdown (Tuyệt chiêu ở đây nè!)
    fetch('http://localhost:5052/api/DanhMucNN')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error("Lỗi Danh mục:", err));
  }, []);

  // 4. LOGIC LỌC DỮ LIỆU
  const filteredCourses = courses.filter(course => {
    const tenKH = course.tenKH || course.tenkh || course.Tenkh || "";
    const danhMucKH = course.danhMuc || course.tendanhmuc || course.Tendanhmuc || "";
    const ngayBD = course.ngayBD || course.ngaybdau || course.Ngaybdau || "";

    const matchSearch = tenKH.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === '' || danhMucKH === selectedCategory;

    // LOGIC LỌC THỜI GIAN MỚI
    let matchMonth = true;
    if (selectedMonth === 'upcoming') {
        // Lọc các khóa học có ngày bắt đầu từ hôm nay đến 30 ngày tới
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 30);
        const courseDate = new Date(ngayBD);
        matchMonth = courseDate >= today && courseDate <= future;
    } else if (selectedMonth !== '') {
        // Lọc theo tháng cụ thể (01, 02, 03...)
        matchMonth = ngayBD && ngayBD.split('-')[1] === selectedMonth;
    }

    return matchSearch && matchCategory && matchMonth;
  });

  return (
    <div className="bg-light min-vh-100 pb-5">
      
      {/* BANNER TRANG KHÓA HỌC */}
      <div className="py-5 text-center shadow-sm" style={{ backgroundColor: '#1a568c', color: 'white' }}>
        <div className="container py-4">
          <h1 className="display-4 fw-bold">Tra Cứu Khóa Học</h1>
          <p className="lead mt-3">Tìm kiếm lộ trình học tập phù hợp nhất với bạn</p>
        </div>
      </div>

      <div className="container mt-5">
        
        {/* THANH TÌM KIẾM & BỘ LỌC */}
        <div className="card shadow-sm border-0 mb-5 rounded-4 p-3" style={{ backgroundColor: '#ffffff' }}>
          <div className="row g-3">
            {/* Ô nhập từ khóa */}
            <div className="col-lg-4 col-md-12">
              <input 
                type="text" 
                className="form-control form-control-lg border-1" 
                placeholder="🔍 Nhập tên khóa học..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Dropdown Danh mục ngoại ngữ (Dữ liệu thật 100%) */}
            <div className="col-lg-4 col-md-6">
              <select 
                className="form-select form-select-lg border-1"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">📚 Tất cả ngoại ngữ</option>
                {categories.map((cat, idx) => {
                  // Bắt lỗi hoa thường để lấy đúng tên danh mục
                  const tenChuan = cat.tendanhmuc || cat.Tendanhmuc || cat.tenDanhMuc;
                  return (
                    <option key={idx} value={tenChuan}>{tenChuan}</option>
                  );
                })}
              </select>
            </div>

            {/* Dropdown Thời gian mở lớp */}
<div className="col-lg-4 col-md-6">
  <select 
    className="form-select form-select-lg border-1"
    value={selectedMonth}
    onChange={(e) => setSelectedMonth(e.target.value)}
  >
    <option value="">🗓️ Tất cả thời gian</option>
    
    {/* Tùy chọn đặc biệt: Sắp khai giảng */}
    <option value="upcoming">🔥 Sắp khai giảng (30 ngày tới)</option>

    {/* Tự động tạo 12 tháng từ tháng 1 đến tháng 12 */}
    {[...Array(12)].map((_, i) => {
      const monthNum = (i + 1).toString().padStart(2, '0'); // Biến 1 thành "01", 2 thành "02"...
      return (
        <option key={monthNum} value={monthNum}>
          Khai giảng tháng {i + 1}
        </option>
      );
    })}
  </select>
</div>
          </div>
        </div>

        {/* HIỂN THỊ KẾT QUẢ TÌM KIẾM */}
        <div className="mb-4">
          <h5 className="text-muted">Tìm thấy <strong className="text-primary">{filteredCourses.length}</strong> khóa học phù hợp</h5>
        </div>

        <div className="row g-4">
          {filteredCourses.length > 0 ? (
  filteredCourses.map((course, index) => {
    // 1. Lấy đúng tên biến từ API (Bao phủ cả các kiểu viết hoa/thường)
    const ngayBD = course.ngayBD || course.ngaybdau || course.Ngaybdau || "";
    const ngayKT = course.ngayKT || course.ngaykthuc || course.Ngaykthuc || "";
    
    const hocPhi = course.hocPhi || course.hocphi || course.Hocphi || 0;
    const tenKH = course.tenKH || course.tenkh || course.Tenkh || "";
    const danhMucKH = course.danhMuc || course.tendanhmuc || course.Tendanhmuc || "";
    const moTa = course.moTa || course.mota || course.Mota || "";

    // Hàm định dạng ngày để code gọn hơn
    const formatDate = (dateStr) => {
      if (!dateStr) return "Chưa cập nhật";
      return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    return (
      <div className="col-lg-3 col-md-6" key={index}>
        <div className="card h-100 shadow-sm border rounded-4 hover-card">
          <div className="card-body p-4 d-flex flex-column">
            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill w-50 mb-3 py-2">
              {danhMucKH}
            </span>
            <h5 className="card-title fw-bold text-dark mb-3">{tenKH}</h5>
            
            <hr className="w-100 text-muted opacity-25 my-0 mb-3" />
            
            <div className="text-secondary mb-3" style={{ fontSize: '0.85rem' }}>
              {/* HIỂN THỊ CẢ NGÀY BẮT ĐẦU VÀ KẾT THÚC */}
              <p className="mb-2">
                📅 <strong>Thời gian:</strong> <br/>
                <span className="text-dark">
                  {formatDate(ngayBD)} - {formatDate(ngayKT)}
                </span>
              </p>
              <p className="mb-2">📝 <strong>Mô tả:</strong> {moTa}</p>
            </div>

            <div className="mt-auto pt-3 d-flex justify-content-between align-items-center border-top">
              <span className="text-danger fw-bold fs-5">
                {hocPhi.toLocaleString('vi-VN')}đ
              </span>
              <button className="btn btn-primary rounded-pill px-3 btn-sm fw-semibold">
                Ghi danh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  })
          ) : (
            <div className="col-12 text-center py-5">
              <h3 className="text-muted">Không tìm thấy khóa học nào phù hợp 😢</h3>
              <button className="btn btn-primary mt-3" onClick={() => {setSearchTerm(''); setSelectedCategory(''); setSelectedMonth('');}}>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}