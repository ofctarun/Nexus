import { Routes, Route } from 'react-router-dom';
import useTokenRefresh from './hooks/useTokenRefresh';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  // Start background token refresh
  useTokenRefresh();

  return (
    <Routes>
      {/* ─── Public Routes ──────────────────────── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* ─── Protected Routes (inside AppLayout) ── */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        {/* All authenticated users */}
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/settings" element={<SettingsPage />} />

        {/* Members + Admins only */}
        <Route
          path="/documents"
          element={
            <ProtectedRoute allowedRoles={['admin', 'member']}>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

        {/* Admins only */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPage />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ─── 404 ────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
