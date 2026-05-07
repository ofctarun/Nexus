import { useSelector } from 'react-redux';
import { useGetChatSessionsQuery, useDeleteChatSessionMutation, useCreateChatSessionMutation } from '../chatApi';
import { selectCurrentSessionId } from '../chatSlice';
import { MessageSquare, Plus, Trash2 } from 'lucide-react';

export default function ChatSidebar({ onSelectSession }) {
  const { data: sessions = [], isLoading } = useGetChatSessionsQuery();
  const [deleteSession] = useDeleteChatSessionMutation();
  const [createSession] = useCreateChatSessionMutation();
  const currentSessionId = useSelector(selectCurrentSessionId);

  const handleNewChat = async () => {
    try {
      const result = await createSession().unwrap();
      onSelectSession(result._id);
    } catch (err) {
      console.error('Failed to create session:', err);
    }
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    try { await deleteSession(sessionId).unwrap(); } catch (err) { console.error('Failed to delete session:', err); }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 w-72 border-r border-gray-200">
      <div className="p-3">
        <button onClick={handleNewChat} className="w-full flex items-center justify-center gap-2 bg-navy-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-navy-600 transition-colors">
          <Plus size={16} />
          New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-2 space-y-1">
        {isLoading ? (
          <div className="flex justify-center p-4"><div className="w-5 h-5 border-2 border-gray-200 border-t-navy-500 rounded-full animate-spin"></div></div>
        ) : sessions.length === 0 ? (
          <p className="text-center text-xs text-gray-400 p-4">No conversations yet</p>
        ) : (
          sessions.map((session) => (
            <button
              key={session._id}
              onClick={() => onSelectSession(session._id)}
              className={`group flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${currentSessionId === session._id ? 'bg-navy-50 text-navy-500 font-medium' : 'hover:bg-gray-100 text-gray-500'}`}
            >
              <MessageSquare size={14} className="flex-shrink-0" />
              <span className="truncate flex-1">{session.title || 'New Chat'}</span>
              <button onClick={(e) => handleDelete(e, session._id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity">
                <Trash2 size={14} />
              </button>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
