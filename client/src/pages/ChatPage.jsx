import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentSession, setMessages } from '../features/chat/chatSlice';
import { useGetChatSessionQuery } from '../features/chat/chatApi';
import ChatSidebar from '../features/chat/components/ChatSidebar';
import ChatWindow from '../features/chat/components/ChatWindow';

export default function ChatPage() {
  const dispatch = useDispatch();
  const [selectedSessionId, setSelectedSessionId] = useState(null);

  const { data: session } = useGetChatSessionQuery(selectedSessionId, {
    skip: !selectedSessionId,
  });

  const handleSelectSession = (sessionId) => {
    setSelectedSessionId(sessionId);
    dispatch(setCurrentSession(sessionId));
    if (session?.messages) {
      dispatch(setMessages(session.messages));
    }
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] -m-6 bg-white">
      <ChatSidebar onSelectSession={handleSelectSession} />
      <div className="flex-1">
        <ChatWindow />
      </div>
    </div>
  );
}
