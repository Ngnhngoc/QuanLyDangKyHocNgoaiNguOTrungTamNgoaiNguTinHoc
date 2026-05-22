import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const role = user?.vaiTro;

    return (
        <div className="bg-dark text-white p-3" style={{ width: '250px', minHeight: '100vh' }}>
            <h4 className="text-center mb-4 border-bottom pb-2">MENU</h4>
            <nav className="nav flex-column gap-2">
                <Link to="/dashboard" className="btn btn-secondary text-start">Trang chủ</Link>

                {role === 'Admin' && (
                    <>
                        <Link to="/khoa-hoc" className="btn btn-outline-light text-start border-0">Quản lý Khóa học</Link>
                        <Link to="/hoc-vien" className="btn btn-outline-light text-start border-0">Quản lý Học viên</Link>
                    </>
                )}

                {(role === 'Admin' || role === 'GiangVien') && (
                    <Link to="/lich-day" className="btn btn-outline-light text-start border-0">Lịch giảng dạy</Link>
                )}

                {role === 'HocVien' && (
                    <Link to="/ket-qua" className="btn btn-outline-light text-start border-0">Kết quả học tập</Link>
                )}
            </nav>
        </div>
    );
};

export default Sidebar;