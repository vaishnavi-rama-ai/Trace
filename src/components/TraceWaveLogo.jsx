// components/TraceLogo.jsx
import React from 'react';
import { Box } from '@mui/material';
import traceWaveLogo from '../assets/trace-wave.png'
const TraceWaveLogo = ({ width = 90, height = 120}) => {
  return (
    <Box
      component="img"
      src={traceWaveLogo}
      alt="Trace Wave Logo"
      sx={{
        width: width,
        height: height,
        display: 'inline-block',
      }}
    />
  );
};

export default TraceWaveLogo;
