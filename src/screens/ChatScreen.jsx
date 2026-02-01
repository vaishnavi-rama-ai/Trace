import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';

const BACKEND_URL = 'http://localhost:3001';

const ChatScreen = ({ onLogout, onBack }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Trace, your journaling companion. How are you feeling today?",
      sender: 'trace',
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}`);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim()) {
      // Add user message to state
      const userMessage = {
        id: messages.length + 1,
        text: messageText,
        sender: 'user',
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        // Call backend API
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: messageText,
            session_id: sessionId,
          }),
        });

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`);
        }

        const data = await response.json();
        
        // Add trace response to state
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: data.response,
            sender: 'trace',
          },
        ]);
      } catch (error) {
        console.error('Error calling backend:', error);
        // Add error message to chat
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "Sorry, I couldn't process that. Please try again.",
            sender: 'trace',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ChatHeader onLogout={onLogout} onBack={onBack} />
      <MessageList messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} isLoading={loading} />
    </Box>
  );
};

export default ChatScreen;