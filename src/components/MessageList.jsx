// components/MessageList.jsx
import React from 'react';
import { Box } from '@mui/material';
import MessageBubble from './MessageBubble';

const MessageList = ({ messages }) => {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        padding: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
      }}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
    </Box>
  );
};

export default MessageList;