// screens/LoginScreen.jsx (updated)
import React from 'react';
import { Box, Button, Container } from '@mui/material';
import TraceLogo from '../components/TraceLogo';

const LoginScreen = ({ onLogin, onNavigateToRegister }) => {
  const handleLogin = (e) => {
    e.preventDefault();
    onLogin();
  };

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
            bgcolor: 'primary.main',
            padding: { xs: '40px 30px', sm: '60px 80px' },
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            textAlign: 'center',
          }}
        >
          <Box sx={{ mb: 5 }}>
            <Box
              component="h1"
              sx={{
                fontSize: { xs: '36px', sm: '48px' },
                fontFamily: 'Georgia, serif',
                m: '0 0 10px 0',
                color: 'text.primary',
                fontWeight: 400,
              }}
            >
              Trace
            </Box>
            <TraceLogo size={60} rotate={true} />
          </Box>

          <Box component="form" onSubmit={handleLogin}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                border: '2px solid #000000',
                padding: '12px 32px',
                fontSize: '16px',
                borderRadius: '4px',
                mb: 1.5,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Login
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={onNavigateToRegister}
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                border: '2px solid #000000',
                padding: '12px 32px',
                fontSize: '16px',
                borderRadius: '4px',
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Register
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginScreen;