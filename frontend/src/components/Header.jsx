import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const user = JSON.parse(sessionStorage.getItem('user'));
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="navbar navbar-light bg-white shadow-sm px-4">
            <span className="navbar-brand mb-0 h1 fs-5 text-muted">Hệ thống Đăng ký Ngoại ngữ</span>
            <div className="d-flex align-items-center">
                <span className="me-3 fw-bold text-primary">Xin chào, {user?.hoTen}</span>
                <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>Đăng xuất</button>
            </div>
        </header>
    );
};

export default Header;