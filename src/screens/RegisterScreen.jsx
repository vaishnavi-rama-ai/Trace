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
} from '@mui/material';
import TraceLogo from '../components/TraceLogo';

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
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log('Form submitted:', formData);
      onRegister();
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
            bgcolor: 'primary.main',
            padding: { xs: '30px 25px', sm: '40px 50px' },
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              component="h1"
              sx={{
                fontSize: { xs: '32px', sm: '40px' },
                fontFamily: 'Georgia, serif',
                m: '0 0 10px 0',
                color: 'text.primary',
                fontWeight: 400,
              }}
            >
              Join Trace
            </Box>
            <TraceLogo size={50} rotate={true} />
          </Box>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              name="name"
              label="Name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: errors.name ? 'error.main' : '#000000',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.name ? 'error.main' : '#000000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.name ? 'error.main' : '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: errors.email ? 'error.main' : '#000000',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.email ? 'error.main' : '#000000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.email ? 'error.main' : '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary',
                  },
                },
              }}
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
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: errors.password ? 'error.main' : '#000000',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.password ? 'error.main' : '#000000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.password ? 'error.main' : '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: errors.confirmPassword ? 'error.main' : '#000000',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: errors.confirmPassword ? 'error.main' : '#000000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: errors.confirmPassword ? 'error.main' : '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary',
                  },
                },
              }}
            />

            <TextField
              fullWidth
              select
              name="language"
              label="Language"
              value={formData.language}
              onChange={handleChange}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                  '& fieldset': {
                    borderColor: '#000000',
                    borderWidth: '2px',
                  },
                  '&:hover fieldset': {
                    borderColor: '#000000',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#000000',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'text.primary',
                  '&.Mui-focused': {
                    color: 'text.primary',
                  },
                },
              }}
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
              sx={{
                bgcolor: 'white',
                color: 'text.primary',
                border: '2px solid #000000',
                padding: '12px 32px',
                fontSize: '16px',
                borderRadius: '4px',
                mb: 2,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#f5f5f5',
                },
              }}
            >
              Create Account
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
                sx={{
                  color: '#000000',
                  fontWeight: 600,
                  textDecorationColor: '#000000',
                  cursor: 'pointer',
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