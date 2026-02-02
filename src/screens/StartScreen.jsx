// screens/StartScreen.jsx
import React from 'react';
import { Box, Button, Container } from '@mui/material';
import TraceWaveLogo from '../components/TraceWaveLogo';
import { COMMON_BUTTON_STYLES, COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const StartScreen = ({ onNavigateToLogin, onNavigateToRegister }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="xs">
        <Box
          sx={{
            ...COMMON_CONTAINER_STYLES.authCard,
            padding: { xs: '40px 30px', sm: '60px 80px' },
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 5 }}>
            <Box component="h1" sx={COMMON_TYPOGRAPHY.pageHeading}>
              Trace
            </Box>
            <TraceWaveLogo width={120} height={150}/>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              onClick={onNavigateToLogin}
              fullWidth
              variant="contained"
              sx={{ ...COMMON_BUTTON_STYLES.whiteBordered }}
            >
              Login
            </Button>
            <Button
              onClick={onNavigateToRegister}
              fullWidth
              variant="contained"
              sx={{ ...COMMON_BUTTON_STYLES.whiteBordered }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default StartScreen;