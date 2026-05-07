import { Outlet } from 'react-router-dom';
import TopBar from './TopBar';

/**
 * AppLayout — Main application shell with top bar + content area.
 * Used as the layout wrapper for all authenticated routes.
 */
export default function AppLayout() {
  return (
    <div className="flex h-screen bg-base-200">
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
