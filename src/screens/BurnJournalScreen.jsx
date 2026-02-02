// screens/BurnJournalScreen.jsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import { ArrowLeft, Flame } from 'lucide-react';
import TraceLogo from '../components/TraceLogo';
import { COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES, COMMON_BUTTON_STYLES } from '../theme/commonStyles';

const BurnJournalScreen = ({ onBack, onLogout }) => {
  const [journalText, setJournalText] = useState('');
  const [isBurning, setIsBurning] = useState(false);

  const handleBurn = () => {
    if (journalText.trim()) {
      setIsBurning(true);
      
      // After animation completes, clear the text
      setTimeout(() => {
        setJournalText('');
        setIsBurning(false);
      }, 2000); // 2 second animation
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
      {/* Header */}
      <AppBar
        position="static"
        sx={COMMON_CONTAINER_STYLES.header}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <IconButton onClick={onBack} sx={{ color: 'text.primary', mr: 1 }}>
              <ArrowLeft size={24} />
            </IconButton>
            <TraceLogo size={40} />
            <Box component="h1" sx={COMMON_TYPOGRAPHY.navTitle}>
              Burn Journal
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          flex: 1,
          py: 4,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box
          sx={{
            flex: 1,
            position: 'relative',
            mb: 3,
          }}
        >
          {/* Burning animation overlay - Simple gradient */}
          {isBurning && (
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 10,
                pointerEvents: 'none',
                background: 'linear-gradient(to top, #000000 0%, #FA582D 50%, rgba(250, 88, 45, 0) 100%)',
                borderRadius: '4px',
                animation: 'burnUp 2s ease-in-out forwards',
                '@keyframes burnUp': {
                  '0%': {
                    clipPath: 'inset(100% 0 0 0)',
                    opacity: 0,
                  },
                  '20%': {
                    opacity: 1,
                  },
                  '100%': {
                    clipPath: 'inset(0 0 0 0)',
                    opacity: 0.9,
                  },
                },
              }}
            />
          )}

          {/* Paper with journal text */}
          <TextField
            fullWidth
            multiline
            placeholder="Write your thoughts here... they will disappear when you burn them."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            disabled={isBurning}
            sx={{
              height: '100%',
              '& .MuiOutlinedInput-root': {
                height: '100%',
                bgcolor: 'white',
                fontFamily: "'Courier New', monospace",
                fontSize: '16px',
                lineHeight: 1.8,
                padding: '24px',
                alignItems: 'flex-start',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                opacity: isBurning ? 0.5 : 1,
                transform: isBurning ? 'scale(0.98)' : 'scale(1)',
                '& fieldset': {
                  borderColor: 'transparent',
                },
                '&:hover fieldset': {
                  borderColor: 'transparent',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
                '& textarea': {
                  height: '100% !important',
                  overflow: 'auto !important',
                },
              },
            }}
          />
        </Box>

        {/* Burn Button */}
        <Button
          onClick={handleBurn}
          disabled={!journalText.trim() || isBurning}
          variant="contained"
          startIcon={<Flame size={24} />}
          sx={{
            bgcolor: 'secondary.main',
            color: 'white',
            padding: '16px 32px',
            fontSize: '18px',
            fontWeight: 600,
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(250, 88, 45, 0.3)',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: '#E84D1F',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(250, 88, 45, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            '&.Mui-disabled': {
              bgcolor: '#CCCCCC',
              color: '#666666',
            },
          }}
        >
          {isBurning ? 'Burning...' : 'Burn'}
        </Button>

        {/* Instruction text */}
        <Box
          sx={{
            mt: 2,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '14px',
          }}
        >
          {journalText.trim()
            ? 'Click "Burn" to let go of these thoughts'
            : 'Write something to burn it away'}
        </Box>
      </Container>
    </Box>
  );
};

export default BurnJournalScreen;