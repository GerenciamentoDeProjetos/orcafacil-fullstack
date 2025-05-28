import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/login/LoginPage';
import RegisterPage from '../pages/register/RegisterPage';
import ForgotPasswordPage from '../pages/forgotpassword/ForgotPasswordPage';
import Dashboard from '../pages/dashboard/Dashboard';
import TransactionsPage from '../pages/transactions/TransactionsPage';
import MonthlyReports from '../pages/monthlyReports/MonthlyReports';
import ReportCategoryPage from '../pages/reportcategory/ReportCategoryPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/transactions" element={<TransactionsPage />} />
      <Route path="/report/monthly" element={<MonthlyReports />} />
      <Route path="/report/category" element={<ReportCategoryPage />} />

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
