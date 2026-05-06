import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setStats, setLogs } from '../store/adminSlice';
import { Users, FileText, Search, Shield } from 'lucide-react';

const Dashboard = () => {
  const { user } = useSelector(state => state.auth);
  const { stats, logs } = useSelector(state => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.role === 'Admin') {
      const fetchAdminData = async () => {
        try {
          const statsRes = await axios.get('http://localhost:5000/api/admin/stats', { withCredentials: true });
          dispatch(setStats(statsRes.data));
          
          const logsRes = await axios.get('http://localhost:5000/api/admin/logs', { withCredentials: true });
          dispatch(setLogs(logsRes.data));
        } catch (error) {
          console.error('Failed to fetch admin stats', error);
        }
      };
      fetchAdminData();
    }
  }, [user, dispatch]);

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Welcome back, {user?.name}</h1>
          <p className="text-base-content/60 mt-1">Role: <span className="badge badge-primary">{user?.role}</span> | Org: {user?.organization?.name || 'Your Organization'}</p>
        </div>
      </div>

      {user?.role === 'Admin' ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-figure text-primary"><Users size={32} /></div>
              <div className="stat-title">Total Users</div>
              <div className="stat-value text-primary">{stats.usersCount}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-figure text-secondary"><FileText size={32} /></div>
              <div className="stat-title">Total Documents</div>
              <div className="stat-value text-secondary">{stats.docsCount}</div>
            </div>
            <div className="stat bg-base-100 shadow rounded-box">
              <div className="stat-figure text-accent"><Search size={32} /></div>
              <div className="stat-title">Queries Today</div>
              <div className="stat-value text-accent">{stats.queriesCount}</div>
            </div>
          </div>

          <div className="card bg-base-100 shadow">
            <div className="card-body">
              <h2 className="card-title flex items-center gap-2"><Shield size={20}/> Enterprise Audit Logs</h2>
              <div className="overflow-x-auto mt-4">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>User</th>
                      <th>Action</th>
                      <th>Details</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log) => (
                      <tr key={log._id}>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                        <td>{log.user?.name || 'System'}</td>
                        <td>{log.action}</td>
                        <td className="text-xs">{log.details}</td>
                        <td>
                          <span className={`badge ${log.result === 'Success' ? 'badge-success' : 'badge-error'} badge-sm`}>
                            {log.result}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {logs.length === 0 && <p className="text-center text-base-content/50 py-4">No audit logs found.</p>}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="card bg-base-100 shadow max-w-2xl">
          <div className="card-body">
            <h2 className="card-title">Member Portal</h2>
            <p className="text-base-content/70">Navigate to Documents to upload your files or use the Secure Chat to query the knowledge base.</p>
            <div className="alert alert-info mt-4">
              <span>Your current clearance level is {user?.role}. You can only access files rated for your clearance.</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
