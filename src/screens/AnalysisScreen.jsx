// screens/AnalysisScreen.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  CircularProgress,
} from '@mui/material';
import { ArrowLeft, LogOut } from 'lucide-react';
import TraceLogo from '../components/TraceLogo';
import LoadingDots from '../components/LoadingDots';
import { COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const BACKEND_URL = 'http://localhost:3001';

const AnalysisScreen = ({ onBack, onLogout }) => {
  const [loading, setLoading] = useState(true);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await fetch(`${BACKEND_URL}/api/analysis`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setError(error.message || 'Failed to generate analysis. Please try again.');
    } finally {
      setLoading(false);
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
              Trace Analysis
            </Box>
          </Box>
          <IconButton onClick={onLogout} sx={{ color: 'text.primary' }}>
            <LogOut size={24} />
          </IconButton>
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
          justifyContent: 'center',
        }}
      >
        {loading ? (
          <Paper
            sx={{
              padding: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              Analyzing your journal entries
            </Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {/* Burning animation dots */}
              <Box
                sx={{
                  position: 'relative',
                  width: '60px',
                  height: '60px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {/* Animated dots */}
                <Box
                  sx={{
                    position: 'relative',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  {/* Dot 1 */}
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FA582D',
                      animation: 'burnPulse 1.4s infinite',
                      animationDelay: '0s',
                      '@keyframes burnPulse': {
                        '0%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '30%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '60%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '100%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                      },
                    }}
                  />
                  
                  {/* Dot 2 */}
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FA582D',
                      animation: 'burnPulse 1.4s infinite',
                      animationDelay: '0.2s',
                      '@keyframes burnPulse': {
                        '0%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '30%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '60%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '100%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                      },
                    }}
                  />
                  
                  {/* Dot 3 */}
                  <Box
                    sx={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#FA582D',
                      animation: 'burnPulse 1.4s infinite',
                      animationDelay: '0.4s',
                      '@keyframes burnPulse': {
                        '0%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '30%': {
                          opacity: 1,
                          transform: 'scale(1)',
                        },
                        '60%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                        '100%': {
                          opacity: 0.3,
                          transform: 'scale(0.8)',
                        },
                      },
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              </Typography>
            </Box>
          </Paper>
        ) : error ? (
          <Paper
            sx={{
              padding: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Typography variant="h6" sx={{ color: 'error.main' }}>
              Error Generating Analysis
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {error}
            </Typography>
            <Button
              onClick={fetchAnalysis}
              variant="contained"
              sx={{
                bgcolor: 'secondary.main',
                '&:hover': {
                  bgcolor: '#E84D1F',
                },
              }}
            >
              Try Again
            </Button>
          </Paper>
        ) : analysis ? (
          <Paper
            sx={{
              padding: 4,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 1 }}>
                Analysis based on {analysis.entry_count} journal entries from the last{' '}
                {analysis.analysis_period_days} days
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                Generated: {new Date(analysis.timestamp).toLocaleDateString()} at{' '}
                {new Date(analysis.timestamp).toLocaleTimeString()}
              </Typography>
            </Box>

            <Box
              sx={{
                bgcolor: '#F5F5F5',
                padding: 3,
                borderRadius: '8px',
                borderLeft: '4px solid #FA582D',
                minHeight: '200px',
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  lineHeight: 1.8,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: 'text.primary',
                }}
              >
                {analysis.insights}
              </Typography>
            </Box>
          </Paper>
        ) : null}
      </Container>
    </Box>
  );
};

export default AnalysisScreen;
