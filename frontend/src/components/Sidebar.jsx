import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/authSlice';
import axios from 'axios';
import { LayoutDashboard, FileText, MessageSquare, LogOut } from 'lucide-react';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/auth/logout', {}, { withCredentials: true });
      dispatch(logout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className="w-64 bg-base-100 flex flex-col border-r border-base-300">
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-primary">NEXUS</h1>
        <p className="text-sm text-base-content/60 mt-1">{user?.role} Portal</p>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link to="/" className="btn btn-ghost w-full justify-start gap-3">
          <LayoutDashboard size={20} /> Dashboard
        </Link>
        <Link to="/documents" className="btn btn-ghost w-full justify-start gap-3">
          <FileText size={20} /> Documents
        </Link>
        <Link to="/chat" className="btn btn-ghost w-full justify-start gap-3">
          <MessageSquare size={20} /> Secure Chat
        </Link>
      </nav>

      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-3 mb-4 px-2">
          <div className="avatar placeholder">
            <div className="bg-neutral text-neutral-content rounded-full w-10">
              <span className="text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <p className="text-xs text-base-content/60 truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="btn btn-outline btn-error w-full gap-2">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
