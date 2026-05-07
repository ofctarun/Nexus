import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { selectCurrentUser, logout } from '../../features/auth/authSlice';
import RoleBadge from '../ui/RoleBadge';
import { LogOut, Bell, ChevronDown, User, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const notifications = [
  { id: 1, title: 'New document uploaded', description: 'Your latest PDF is ready in File Manager.' },
  { id: 2, title: 'New chat reply', description: 'Nexus has answered your latest question.' },
  { id: 3, title: 'Organization update', description: 'A new policy was shared with your team.' },
];

export default function TopBar() {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const menuRef = useRef(null);

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((segment) => segment[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ME';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowNotifications(false);
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout', {}, { withCredentials: true });
    } catch {
      // Continue with client-side logout even if server call fails
    }
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="bg-navy-900 border-b border-navy-800 px-6 py-3 relative z-10 shadow-md">
      <div className="flex items-center justify-between">
        {/* Left Side: NEXUS Branding */}
        <div className="flex items-center">
          <Link 
            to="/dashboard" 
            className="text-3xl font-bold tracking-widest text-white drop-shadow-md"
            style={{ fontFamily: '"Smooch Sans", sans-serif' }}
          >
            NEXUS
          </Link>
        </div>

        {/* Right Side: Role, Notifications, Profile */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <div className="flex items-center gap-2">
            <span className="text-sm text-navy-200 hidden sm:inline-block">Role</span>
            <RoleBadge role={user?.role} />
          </div>
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications((current) => !current);
                setShowProfileMenu(false);
              }}
              className="p-2 rounded-xl border border-navy-700 bg-navy-800 text-navy-100 hover:bg-navy-700 transition"
              aria-label="Notifications"
            >
              <Bell size={18} />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 rounded-3xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-500">Latest updates for your member account</p>
                </div>
                <div className="divide-y divide-gray-100">
                  {notifications.map((item) => (
                    <div key={item.id} className="px-4 py-3 hover:bg-gray-50 transition">
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-3 text-right">
                  <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                    View all
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu((current) => !current);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 rounded-full border border-navy-700 bg-navy-800 px-3 py-2 text-sm text-navy-100 hover:bg-navy-700 transition"
              aria-label="Profile menu"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-navy-600 text-sm font-semibold text-white">
                {initials}
              </span>
              <ChevronDown size={16} />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-56 rounded-3xl border border-gray-200 bg-white shadow-lg ring-1 ring-black/5 overflow-hidden">
                <Link
                  to="/personalization"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <User size={16} />
                  <span>Personalization</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition"
                >
                  <Settings size={16} />
                  <span>Settings</span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
