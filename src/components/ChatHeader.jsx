// components/ChatHeader.jsx
import React from 'react';
import { AppBar, Toolbar, Box, IconButton } from '@mui/material';
import { LogOut, ArrowLeft } from 'lucide-react';
import TraceLogo from './TraceLogo';
import { COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const ChatHeader = ({ onLogout, onBack }) => {
  return (
    <AppBar
      position="static"
      sx={COMMON_CONTAINER_STYLES.header}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          {onBack && (
            <IconButton onClick={onBack} sx={{ color: 'text.primary', mr: 1 }}>
              <ArrowLeft size={24} />
            </IconButton>
          )}
          <TraceLogo size={70} />
          <Box component="h1" sx={COMMON_TYPOGRAPHY.navTitle}>
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