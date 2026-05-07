import { useState } from 'react';
import StatsCards from '../features/admin/components/StatsCards';
import UserTable from '../features/admin/components/UserTable';
import AdminDocTable from '../features/admin/components/AdminDocTable';
import AuditLogViewer from '../features/admin/components/AuditLogViewer';

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'users', label: 'Users' },
  { id: 'documents', label: 'Documents' },
  { id: 'audit', label: 'Audit Logs' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Central command center for your organization.</p>
      </div>

      <div className="flex border-b border-gray-200 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.id ? 'border-navy-500 text-navy-500' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'overview' && <StatsCards />}
        {activeTab === 'users' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Organization Members</h2>
            <UserTable />
          </div>
        )}
        {activeTab === 'documents' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">All Organization Documents</h2>
            <AdminDocTable />
          </div>
        )}
        {activeTab === 'audit' && (
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Audit Logs</h2>
            <AuditLogViewer />
          </div>
        )}
      </div>
    </div>
  );
}
