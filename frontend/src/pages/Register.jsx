import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { setCredentials } from '../store/authSlice';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', inviteCode: '', orgName: '' });
  const [mode, setMode] = useState('join'); // 'join' or 'create'
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const payload = { 
        name: formData.name, 
        email: formData.email, 
        password: formData.password,
        ...(mode === 'join' ? { inviteCode: formData.inviteCode } : { orgName: formData.orgName })
      };
      const res = await axios.post('http://localhost:5000/api/auth/register', payload, { withCredentials: true });
      dispatch(setCredentials(res.data));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 py-10">
      <div className="card w-full max-w-md shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-3xl font-bold text-center text-primary mb-2">Join Nexus</h2>
          <p className="text-center text-base-content/70 mb-6">Create your secure profile</p>
          
          {error && <div className="alert alert-error text-sm py-2">{error}</div>}
          
          <div className="tabs tabs-boxed mb-4 justify-center">
            <a className={`tab ${mode === 'join' ? 'tab-active' : ''}`} onClick={() => setMode('join')}>Join Organization</a>
            <a className={`tab ${mode === 'create' ? 'tab-active' : ''}`} onClick={() => setMode('create')}>Create New</a>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Full Name</span></label>
              <input type="text" className="input input-bordered w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" className="input input-bordered w-full" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Password</span></label>
              <input type="password" className="input input-bordered w-full" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
            </div>

            {mode === 'join' ? (
              <div className="form-control">
                <label className="label"><span className="label-text">Invite Code</span></label>
                <input type="text" className="input input-bordered w-full" placeholder="e.g. A1B2C3" value={formData.inviteCode} onChange={e => setFormData({...formData, inviteCode: e.target.value})} required />
              </div>
            ) : (
              <div className="form-control">
                <label className="label"><span className="label-text">Organization Name</span></label>
                <input type="text" className="input input-bordered w-full" placeholder="e.g. Acme Corp" value={formData.orgName} onChange={e => setFormData({...formData, orgName: e.target.value})} required />
              </div>
            )}
            
            <button type="submit" className="btn btn-primary w-full mt-4">Register</button>
          </form>
          
          <div className="divider">OR</div>
          <div className="text-center">
            <Link to="/login" className="link link-hover text-sm">Already have an account? Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
