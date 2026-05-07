<<<<<<< HEAD
import { Outlet } from 'react-router-dom';
=======
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
>>>>>>> 340e0d188a7f2797d084bf011c5df4feca45c5ab
import TopBar from './TopBar';

/**
 * AppLayout — Main application shell with top bar + content area.
 * Used as the layout wrapper for all authenticated routes.
 */
export default function AppLayout() {
  const location = useLocation();
  const hideSidebar = location.pathname === '/dashboard';

  return (
    <div className="flex h-screen bg-base-200">
<<<<<<< HEAD
      {/* Main Content */}
=======
      {!hideSidebar && <Sidebar />}

>>>>>>> 340e0d188a7f2797d084bf011c5df4feca45c5ab
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
