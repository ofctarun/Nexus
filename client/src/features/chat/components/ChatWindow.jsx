import { useSelector } from 'react-redux';
import { selectMessages, selectIsStreaming } from '../chatSlice';
import MessageBubble from './MessageBubble';
import ChatInput from './ChatInput';
import { MessageSquare } from 'lucide-react';

export default function ChatWindow() {
  const messages = useSelector(selectMessages);
  const isStreaming = useSelector(selectIsStreaming);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-300">
            <MessageSquare size={48} className="mb-4 opacity-30" />
            <h3 className="text-lg font-semibold text-gray-400">Start a Conversation</h3>
            <p className="text-sm mt-1 text-gray-400">Ask questions about your organization's documents</p>
          </div>
        ) : (
          messages.map((msg, index) => <MessageBubble key={index} message={msg} />)
        )}
        {isStreaming && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]"></div>
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]"></div>
            </div>
            Nexus is thinking...
          </div>
        )}
      </div>
      <ChatInput />
    </div>
  );
}
