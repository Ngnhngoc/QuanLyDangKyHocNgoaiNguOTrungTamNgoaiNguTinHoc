import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import './AppNotification.css';

const NotificationContext = createContext(null);

const iconMap = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
};

const titleMap = {
  success: 'Thành công',
  error: 'Lỗi',
  warning: 'Cảnh báo',
  info: 'Thông báo',
};

export function AppNotificationProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [modal, setModal] = useState(null);

  const showToast = useCallback((message, type = 'info', duration = 3200) => {
    const id = Date.now() + Math.random();

    const toast = {
      id,
      type,
      message,
      title: titleMap[type] || 'Thông báo',
      icon: iconMap[type] || 'ℹ️',
    };

    setToasts((prev) => [...prev, toast]);

    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const showAlert = useCallback((message, type = 'info') => {
    setModal({
      mode: 'alert',
      type,
      title: titleMap[type] || 'Thông báo',
      message,
      icon: iconMap[type] || 'ℹ️',
      onOk: null,
      onCancel: null,
    });
  }, []);

  const showConfirm = useCallback(({ title = 'Xác nhận thao tác', message = '', type = 'warning' }) => {
    return new Promise((resolve) => {
      setModal({
        mode: 'confirm',
        type,
        title,
        message,
        icon: iconMap[type] || '⚠️',
        onOk: () => resolve(true),
        onCancel: () => resolve(false),
      });
    });
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
  }, []);

  const handleModalOk = () => {
    if (modal?.onOk) {
      modal.onOk();
    }

    closeModal();
  };

  const handleModalCancel = () => {
    if (modal?.onCancel) {
      modal.onCancel();
    }

    closeModal();
  };

  useEffect(() => {
    window.showToast = showToast;
    window.appAlert = showAlert;
    window.appConfirm = showConfirm;

    const oldAlert = window.alert;

    window.alert = (message) => {
      showAlert(String(message || ''), 'info');
    };

    return () => {
      window.alert = oldAlert;
      delete window.showToast;
      delete window.appAlert;
      delete window.appConfirm;
    };
  }, [showToast, showAlert, showConfirm]);

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        showAlert,
        showConfirm,
      }}
    >
      {children}

      <div className="app-toast-wrapper">
        {toasts.map((toast) => (
          <div key={toast.id} className={`app-toast app-toast-${toast.type}`}>
            <div className="app-toast-icon">
              {toast.icon}
            </div>

            <div className="app-toast-content">
              <div className="app-toast-title">
                {toast.title}
              </div>

              <div className="app-toast-message">
                {toast.message}
              </div>
            </div>

            <button
              type="button"
              className="app-toast-close"
              onClick={() => removeToast(toast.id)}
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {modal && (
        <div className="app-modal-backdrop">
          <div className={`app-modal-card app-modal-${modal.type}`}>
            <div className="app-modal-icon">
              {modal.icon}
            </div>

            <div className="app-modal-body">
              <h5>
                {modal.title}
              </h5>

              <p>
                {modal.message}
              </p>
            </div>

            <div className="app-modal-actions">
              {modal.mode === 'confirm' && (
                <button
                  type="button"
                  className="app-btn app-btn-light"
                  onClick={handleModalCancel}
                >
                  Hủy
                </button>
              )}

              <button
                type="button"
                className="app-btn app-btn-primary"
                onClick={handleModalOk}
              >
                {modal.mode === 'confirm' ? 'Đồng ý' : 'Đã hiểu'}
              </button>
            </div>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

export function useAppNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useAppNotification phải được dùng bên trong AppNotificationProvider');
  }

  return context;
}