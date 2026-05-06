import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setSessions, setCurrentSession, addMessage } from '../store/chatSlice';
import { Send, Plus, Trash2, Bot, User as UserIcon } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

const Chat = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { sessions, currentSessionId, messages } = useSelector(state => state.chat);
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/chat/sessions', { withCredentials: true });
        dispatch(setSessions(res.data));
      } catch (err) {
        console.error('Failed to fetch sessions', err);
      }
    };
    fetchSessions();
  }, [dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleNewChat = () => {
    dispatch(setCurrentSession({ session_id: uuidv4(), messages: [] }));
  };

  const handleSelectSession = (session) => {
    dispatch(setCurrentSession(session));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    let sessionId = currentSessionId;
    if (!sessionId) {
      sessionId = uuidv4();
      dispatch(setCurrentSession({ session_id: sessionId, messages: [] }));
    }

    const message = input;
    setInput('');
    dispatch(addMessage({ role: 'user', content: message }));
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/chat/message', {
        session_id: sessionId,
        message
      }, { withCredentials: true });
      
      // Assume backend returns the entire updated session
      dispatch(setCurrentSession(res.data));
      
      // Update session list to reflect title changes
      const sessionsRes = await axios.get('http://localhost:5000/api/chat/sessions', { withCredentials: true });
      dispatch(setSessions(sessionsRes.data));
    } catch (err) {
      console.error('Message send failed', err);
      dispatch(addMessage({ role: 'assistant', content: 'Error: Could not reach the server.' }));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSession = async (id, e) => {
    e.stopPropagation();
    try {
      await axios.delete(`http://localhost:5000/api/chat/sessions/${id}`, { withCredentials: true });
      dispatch(setSessions(sessions.filter(s => s.session_id !== id)));
      if (currentSessionId === id) handleNewChat();
    } catch (err) {
      console.error('Delete session failed', err);
    }
  };

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-64 bg-base-100 border-r border-base-300 flex flex-col">
        <div className="p-4 border-b border-base-300">
          <button onClick={handleNewChat} className="btn btn-outline btn-primary w-full gap-2">
            <Plus size={18} /> New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map(session => (
            <div 
              key={session.session_id}
              onClick={() => handleSelectSession(session)}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-base-200 transition-colors ${currentSessionId === session.session_id ? 'bg-base-200 shadow-sm border border-base-300' : ''}`}
            >
              <div className="truncate text-sm font-medium">{session.title}</div>
              <button onClick={(e) => handleDeleteSession(session.session_id, e)} className="text-base-content/40 hover:text-error">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-base-200">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {(!messages || messages.length === 0) && (
            <div className="h-full flex items-center justify-center flex-col text-base-content/50">
              <Bot size={48} className="mb-4 opacity-50" />
              <h2 className="text-2xl font-bold mb-2">Nexus AI Core</h2>
              <p>Ask a question based on your clearance level.</p>
            </div>
          )}
          
          {messages?.map((msg, idx) => (
            <div key={idx} className={`chat ${msg.role === 'user' ? 'chat-end' : 'chat-start'}`}>
              <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                  {msg.role === 'user' ? <UserIcon size={20} /> : <Bot size={20} />}
                </div>
              </div>
              <div className="chat-header opacity-50 mb-1 capitalize">
                {msg.role}
              </div>
              <div className={`chat-bubble ${msg.role === 'user' ? 'chat-bubble-primary' : 'chat-bubble-neutral'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && (
            <div className="chat chat-start">
              <div className="chat-image avatar">
                <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                  <Bot size={20} />
                </div>
              </div>
              <div className="chat-bubble chat-bubble-neutral flex items-center gap-2">
                <span className="loading loading-dots loading-sm"></span> Analyzing documents...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-base-100 border-t border-base-300">
          <form onSubmit={handleSend} className="max-w-4xl mx-auto relative">
            <input
              type="text"
              className="input input-bordered w-full pr-12 focus:outline-none focus:border-primary shadow-sm"
              placeholder="Query the warehouse..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 btn btn-sm btn-circle btn-primary"
              disabled={!input.trim() || loading}
            >
              <Send size={16} />
            </button>
          </form>
          <div className="text-center mt-2 text-xs text-base-content/50">
            Nexus AI can make mistakes. Verify critical information.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
