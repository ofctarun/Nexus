import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentSessionId, selectIsStreaming, addMessage } from '../chatSlice';
import { useSendMessageMutation } from '../chatApi';
import { Send, Mic } from 'lucide-react';

export default function ChatInput() {
  const [message, setMessage] = useState('');
  const sessionId = useSelector(selectCurrentSessionId);
  const isStreaming = useSelector(selectIsStreaming);
  const [sendMessage, { isLoading }] = useSendMessageMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || !sessionId || isStreaming) return;
    const userMessage = message.trim();
    setMessage('');
    dispatch(addMessage({ role: 'user', content: userMessage, timestamp: new Date().toISOString() }));
    try {
      const result = await sendMessage({ sessionId, message: userMessage }).unwrap();
      dispatch(addMessage({ role: 'assistant', content: result.response, sources: result.sources || [], fromCache: result.fromCache || false, timestamp: new Date().toISOString() }));
    } catch {
      dispatch(addMessage({ role: 'assistant', content: 'Sorry, something went wrong. Please try again.', timestamp: new Date().toISOString() }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4">
      <div className="flex items-center gap-2">
        <button type="button" className="p-2 text-gray-300 rounded-full cursor-not-allowed" title="Voice input (coming soon)" disabled>
          <Mic size={18} />
        </button>
        <input
          type="text" value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask about your documents..."
          className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-navy-500/20 focus:border-navy-500 transition-colors"
          disabled={!sessionId || isStreaming || isLoading}
        />
        <button type="submit" className="p-2.5 bg-navy-500 text-white rounded-xl hover:bg-navy-600 transition-colors disabled:opacity-30" disabled={!message.trim() || !sessionId || isStreaming || isLoading}>
          <Send size={16} />
        </button>
      </div>
    </form>
  );
}
