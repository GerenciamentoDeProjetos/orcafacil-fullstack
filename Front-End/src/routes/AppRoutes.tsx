import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import ForgotPasswordPage from '../pages/forgotpassword/ForgotPasswordPage';
import Dashboard from '../pages/dashboard/Dashboard';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
