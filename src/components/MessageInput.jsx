// components/MessageInput.jsx
import React, { useState } from 'react';
import { Box, TextField, IconButton, Paper } from '@mui/material';
import { Send, Plus } from 'lucide-react';
import { COMMON_BUTTON_STYLES } from '../theme/commonStyles';

const MessageInput = ({ onSendMessage, isLoading, onNewChat }) => {
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
          multiline
          maxRows={4}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Share your thoughts with Trace..."
          disabled={isLoading}
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '24px',
              bgcolor: 'background.default',
              padding: '8px 12px',
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
            '& .MuiOutlinedInput-input': {
              maxHeight: '120px',
              overflowY: 'auto',
              fontSize: '16px',
              lineHeight: 1.5,
            },
          }}
        />
        {onNewChat && (
          <IconButton
            onClick={onNewChat}
            sx={{
              ...COMMON_BUTTON_STYLES.iconButton,
              bgcolor: 'primary.main',
              color: 'text.primary',
              '&:hover': {
                bgcolor: '#F58A6E',
                transform: 'scale(1.05)',
              },
            }}
          >
            <Plus size={20} />
          </IconButton>
        )}
        <IconButton
          type="submit"
          disabled={isLoading || !inputMessage.trim()}
          sx={{
            ...COMMON_BUTTON_STYLES.iconButton,
            bgcolor: 'secondary.main',
            color: 'white',
            '&:hover': {
              bgcolor: 'secondary.main',
              transform: 'scale(1.05)',
            },
            '&.Mui-disabled': {
              bgcolor: '#CCCCCC',
              color: '#666666',
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