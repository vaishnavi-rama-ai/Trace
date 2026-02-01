// components/ChatHeader.jsx (updated with back button)
import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { LogOut, ArrowLeft } from 'lucide-react';
import TraceLogo from './TraceLogo';

const ChatHeader = ({ onLogout, onBack }) => {
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: 'primary.main',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onBack && (
            <IconButton onClick={onBack} sx={{ color: 'text.primary', mr: 1 }}>
              <ArrowLeft size={24} />
            </IconButton>
          )}
          <TraceLogo size={40} />
          <Box
            component="h1"
            sx={{
              fontSize: '28px',
              fontFamily: 'Georgia, serif',
              m: 0,
              color: 'text.primary',
              fontWeight: 400,
            }}
          >
            Trace
          </Box>
        </Box>
        <IconButton onClick={onLogout} sx={{ color: 'text.primary' }}>
          <LogOut size={24} />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default ChatHeader;