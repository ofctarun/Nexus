import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser, selectUserRole } from '../features/auth/authSlice';
import StatsCards from '../features/admin/components/StatsCards';
import { FileText, MessageSquare, Shield } from 'lucide-react';

export default function DashboardPage() {
  const user = useSelector(selectCurrentUser);
  const role = useSelector(selectUserRole);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'User'} 👋</h1>
        <p className="text-gray-400 mt-1">Here's what's happening in your organization today.</p>
      </div>

      {role === 'admin' && <StatsCards />}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/chat" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="bg-navy-50 rounded-xl p-3"><MessageSquare size={22} className="text-navy-500" /></div>
            <div>
              <h3 className="font-semibold text-gray-900">Start Chat</h3>
              <p className="text-xs text-gray-400">Query your documents with AI</p>
            </div>
          </div>
        </Link>

        {role !== 'guest' && (
          <Link to="/documents" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 rounded-xl p-3"><FileText size={22} className="text-emerald-500" /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Files</h3>
                <p className="text-xs text-gray-400">Add documents to the knowledge base</p>
              </div>
            </div>
          </Link>
        )}

        {role === 'admin' && (
          <Link to="/admin" className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-amber-50 rounded-xl p-3"><Shield size={22} className="text-amber-500" /></div>
              <div>
                <h3 className="font-semibold text-gray-900">Admin Panel</h3>
                <p className="text-xs text-gray-400">Manage users and security</p>
              </div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
