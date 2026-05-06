import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setDocuments, addDocument, removeDocument } from '../store/documentSlice';
import { Upload, Trash2, FileIcon } from 'lucide-react';

const Documents = () => {
  const [file, setFile] = useState(null);
  const [permissionLevel, setPermissionLevel] = useState('Guest');
  const [uploading, setUploading] = useState(false);
  const { documents } = useSelector(state => state.document);
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/documents', { withCredentials: true });
        dispatch(setDocuments(res.data));
      } catch (err) {
        console.error('Failed to fetch documents', err);
      }
    };
    fetchDocs();
  }, [dispatch]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('permissionLevel', permissionLevel);

    try {
      const res = await axios.post('http://localhost:5000/api/documents/upload', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      dispatch(addDocument(res.data));
      setFile(null);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Upload failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/documents/${id}`, { withCredentials: true });
      dispatch(removeDocument(id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Delete failed');
    }
  };

  const canDelete = (doc) => {
    return user?.role === 'Admin' || doc.uploader?._id === user?._id;
  };

  return (
    <div className="p-8 h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-base-content">Secure Document Center</h1>
          <p className="text-base-content/60 mt-1">Upload and manage knowledge base files.</p>
        </div>
      </div>

      {(user?.role === 'Admin' || user?.role === 'Member') && (
        <div className="card bg-base-100 shadow mb-8">
          <div className="card-body">
            <h2 className="card-title text-lg mb-4 flex items-center gap-2"><Upload size={20}/> Upload New Document</h2>
            <form onSubmit={handleUpload} className="flex flex-col md:flex-row gap-4 items-end">
              <div className="form-control w-full max-w-xs">
                <label className="label"><span className="label-text">Select File</span></label>
                <input type="file" className="file-input file-input-bordered w-full max-w-xs" onChange={(e) => setFile(e.target.files[0])} accept=".pdf,.txt,.docx" required />
              </div>
              <div className="form-control w-full max-w-xs">
                <label className="label"><span className="label-text">Clearance Level</span></label>
                <select className="select select-bordered" value={permissionLevel} onChange={(e) => setPermissionLevel(e.target.value)}>
                  {user?.role === 'Admin' && <option value="Admin">Admin Only</option>}
                  <option value="Member">Members & Admins</option>
                  <option value="Guest">Public (Guest)</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary" disabled={!file || uploading}>
                {uploading ? <span className="loading loading-spinner"></span> : 'Upload'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="card bg-base-100 shadow flex-1">
        <div className="card-body">
          <h2 className="card-title">Available Documents</h2>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Clearance</th>
                  <th>Uploader</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr key={doc._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <FileIcon size={20} className="text-primary" />
                        <span className="font-medium">{doc.title}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${doc.permissionLevel === 'Admin' ? 'badge-error' : doc.permissionLevel === 'Member' ? 'badge-info' : 'badge-success'}`}>
                        {doc.permissionLevel}
                      </span>
                    </td>
                    <td>{doc.uploader?.name || 'Unknown'}</td>
                    <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                    <td>
                      {canDelete(doc) && (
                        <button onClick={() => handleDelete(doc._id)} className="btn btn-ghost btn-sm text-error">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {documents.length === 0 && <p className="text-center text-base-content/50 py-10">No documents found for your clearance level.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documents;
