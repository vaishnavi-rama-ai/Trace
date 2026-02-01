// components/MessageInput.jsx
import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, isLoading = false }) => {
  const [inputMessage, setInputMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isLoading) {
      onSendMessage(inputMessage);
      setInputMessage('');
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      elevation={0}
      sx={{
        padding: 3,
        bgcolor: 'background.paper',
        borderTop: '2px solid',
        borderColor: 'primary.main',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          gap: 1.5,
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        <TextField
          fullWidth
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Share your thoughts with Trace..."
          variant="outlined"
          disabled={isLoading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: 'background.default',
              '& fieldset': {
                borderColor: 'primary.main',
                borderWidth: '2px',
              },
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <IconButton
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            width: '48px',
            height: '48px',
            '&:hover': {
              bgcolor: 'secondary.main',
              transform: isLoading ? 'scale(1)' : 'scale(1.05)',
            },
            transition: 'transform 0.2s',
            '&:disabled': {
              bgcolor: '#ccc',
              color: '#999',
            },
          }}
        >
          <Send size={20} />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default MessageInput;