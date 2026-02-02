// components/LoadingDots.jsx
import React from 'react';
import { Box } from '@mui/material';
import './LoadingDots.css';

const LoadingDots = ({ size = 'medium', color = 'primary' }) => {
  const sizeMap = {
    small: 4,
    medium: 8,
    large: 12,
  };

  const dotSize = sizeMap[size] || sizeMap.medium;

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        alignItems: 'center',
      }}
    >
      <Box
        className="loading-dot"
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: `${color}.main`,
          animation: 'dot-pulse 1.4s infinite',
          animationDelay: '0s',
        }}
      />
      <Box
        className="loading-dot"
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: `${color}.main`,
          animation: 'dot-pulse 1.4s infinite',
          animationDelay: '0.2s',
        }}
      />
      <Box
        className="loading-dot"
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          backgroundColor: `${color}.main`,
          animation: 'dot-pulse 1.4s infinite',
          animationDelay: '0.4s',
        }}
      />
    </Box>
  );
};

export default LoadingDots;
