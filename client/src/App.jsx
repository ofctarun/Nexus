import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, initComplete, selectIsInitialized } from './features/auth/authSlice';
import axios from 'axios';
import useTokenRefresh from './hooks/useTokenRefresh';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';

let authInitAttempted = false;

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ChatPage from './pages/ChatPage';
import DocumentsPage from './pages/DocumentsPage';
import VoiceAssistantPage from './pages/VoiceAssistantPage';
import PersonalizationPage from './pages/PersonalizationPage';
import AdminPage from './pages/AdminPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  const dispatch = useDispatch();
  const isInitialized = useSelector(selectIsInitialized);

  // Initial Auth Check
  useEffect(() => {
    if (authInitAttempted) return;
    authInitAttempted = true;

    const checkAuth = async () => {
      try {
        const { data } = await axios.get('/api/auth/refresh', { withCredentials: true });
        dispatch(setCredentials(data));
      } catch {
        // No valid session, just finish init
      } finally {
        dispatch(initComplete());
      }
    };
    checkAuth();
  }, [dispatch]);

  // Start background token refresh (only runs if token exists)
  useTokenRefresh();

  if (!isInitialized) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-navy-500/20 border-t-navy-500 rounded-full animate-spin"></div>
      </div>
    );
  }

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
        <Route path="/voice" element={<VoiceAssistantPage />} />
        <Route path="/personalization" element={<PersonalizationPage />} />
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
