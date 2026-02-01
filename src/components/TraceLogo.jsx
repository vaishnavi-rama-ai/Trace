// components/TraceLogo.jsx
import React from 'react';
import { Box } from '@mui/material';
import traceLogo from '../assets/trace-logo.png'
const TraceLogo = ({ size = 40, rotate = false }) => {
  return (
    <Box
      component="img"
      src={traceLogo}
      alt="Trace Logo"
      sx={{
        width: size,
        height: size,
        transform: rotate ? 'rotate(-15deg)' : 'none',
        display: 'inline-block',
      }}
    />
  );
};

export default TraceLogo;
