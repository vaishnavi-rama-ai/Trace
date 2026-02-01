// components/MessageBubble.jsx
import React from 'react';
import { Box } from '@mui/material';
import TraceLogo from './TraceLogo';

const MessageBubble = ({ message }) => {
  const isTrace = message.sender === 'trace';

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isTrace ? 'flex-start' : 'flex-end',
        gap: 1.5,
      }}
    >
      {isTrace && (
        <Box sx={{ flexShrink: 0, pt: 0.5 }}>
          <TraceLogo size={120} />
        </Box>
      )}
      
      <Box
        sx={{
          maxWidth: '70%',
          padding: '12px 18px',
          borderRadius: '20px',
          bgcolor: isTrace ? 'white' : 'primary.main',
          color: 'text.primary',
          boxShadow: isTrace ? 'none' : '0 2px 4px rgba(0,0,0,0.1)',
          border: isTrace ? '2px solid #FA582D' : 'none',
          fontSize: '16px',
          lineHeight: 1.5,
        }}
      >
        {isTrace && (
          <Box
            component="strong"
            sx={{
              fontSize: '15px',
              display: 'block',
              mb: 0.5,
            }}
          >
            Trace
          </Box>
        )}
        {message.text}
      </Box>
    </Box>
  );
};

export default MessageBubble;