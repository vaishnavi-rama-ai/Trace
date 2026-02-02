// screens/RegisterScreen.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  MenuItem,
  Typography,
  Link,
  CircularProgress,
  Alert,
} from '@mui/material';
import TraceLogo from '../components/TraceLogo';
import { COMMON_BUTTON_STYLES, COMMON_INPUT_STYLES, COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const API_URL = 'http://localhost:3001';

const languages = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'it', label: 'Italian' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'zh', label: 'Chinese' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
];

const RegisterScreen = ({ onRegister, onNavigateToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    language: 'en',
  });

  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Username is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setGeneralError('');

    try {
      console.log('Attempting to register with API URL:', API_URL);
      
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.name.trim().replace(/\s+/g, '_').toLowerCase(),
          email: formData.email,
          password: formData.password,
          full_name: formData.name,
          language: formData.language,
        }),
      });

      console.log('Response status:', response.status);

      const data = await response.json();

      if (!response.ok) {
        console.error('Registration error:', data);
        setGeneralError(data.detail || 'Registration failed');
        return;
      }

      // Save token and user info to localStorage
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      onRegister(data.user, data.access_token);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      console.error('Registration error:', errorMsg, error);
      setGeneralError(`Network error: ${errorMsg}. Make sure backend is running on ${API_URL}`);
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
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            ...COMMON_CONTAINER_STYLES.authCard,
            padding: { xs: '30px 25px', sm: '40px 50px' },
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box component="h1" sx={COMMON_TYPOGRAPHY.smallHeading}>
              Join Trace
            </Box>
            <TraceLogo size={90} />
          </Box>

          {generalError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {generalError}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} noValidate>
            {['name', 'email', 'password', 'confirmPassword'].map((fieldName) => (
              <TextField
                key={fieldName}
                fullWidth
                name={fieldName}
                label={fieldName === 'confirmPassword' ? 'Confirm Password' : fieldName === 'name' ? 'Username' : fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                type={fieldName === 'email' ? 'email' : fieldName.includes('password') ? 'password' : 'text'}
                value={formData[fieldName]}
                onChange={handleChange}
                disabled={loading}
                error={!!errors[fieldName]}
                helperText={errors[fieldName]}
                sx={{ ...COMMON_INPUT_STYLES.textFieldWithError(!!errors[fieldName]), mb: 2 }}
              />
            ))}

            <TextField
              fullWidth
              select
              name="language"
              label="Language"
              value={formData.language}
              onChange={handleChange}
              disabled={loading}
              sx={{ ...COMMON_INPUT_STYLES.textField, mb: 3 }}
            >
              {languages.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ ...COMMON_BUTTON_STYLES.whiteBordered, mb: 2 }}
            >
              {loading ? <CircularProgress size={20} /> : 'Create Account'}
            </Button>

            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'text.primary',
              }}
            >
              Already have an account?{' '}
              <Link
                component="button"
                type="button"
                onClick={onNavigateToLogin}
                disabled={loading}
                sx={{
                  color: '#000000',
                  fontWeight: 600,
                  textDecorationColor: '#000000',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default RegisterScreen;