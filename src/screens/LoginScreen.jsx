// screens/LoginScreen.jsx
import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Link, IconButton, CircularProgress, Alert } from '@mui/material';
import { ArrowLeft } from 'lucide-react';
import TraceWaveLogo from '../components/TraceWaveLogo';
import { COMMON_BUTTON_STYLES, COMMON_INPUT_STYLES, COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

const LoginScreen = ({ onLogin, onNavigateToRegister, onBack }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
    setGeneralError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setGeneralError(data.detail || 'Login failed');
        return;
      }

      // Save token and user info to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onLogin(data.user, data.access_token);
    } catch (error) {
      setGeneralError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
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
            ...COMMON_CONTAINER_STYLES.authCard,
            padding: { xs: '40px 30px', sm: '50px 60px' },
            position: 'relative',
          }}
        >
          {onBack && (
            <IconButton
              onClick={onBack}
              disabled={loading}
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                color: 'text.primary',
              }}
            >
              <ArrowLeft size={24} />
            </IconButton>
          )}

          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box component="h1" sx={COMMON_TYPOGRAPHY.pageHeading}>
              Welcome Back
            </Box>
            <TraceWaveLogo width={100} height={130} />
          </Box>

          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <TextField
              fullWidth
              name="username"
              label="Username"
              value={formData.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              disabled={loading}
              sx={{ ...COMMON_INPUT_STYLES.textFieldWithError(!!errors.username), mb: 2 }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password}
              disabled={loading}
              sx={{ ...COMMON_INPUT_STYLES.textFieldWithError(!!errors.password), mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ ...COMMON_BUTTON_STYLES.whiteBordered, mb: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Login'}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'text.primary',
                mb: 1,
              }}
            >
              Don't have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onNavigateToRegister}
                disabled={loading}
                sx={{
                  color: '#000000',
                  fontWeight: 600,
                  textDecorationColor: '#000000',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Register
              </Link>
            </Typography>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
              }}
            >
              <Link
                component="button"
                type="button"
                sx={{
                  color: '#000000',
                  textDecorationColor: '#000000',
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginScreen;