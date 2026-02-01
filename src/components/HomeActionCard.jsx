// components/HomeActionCard.jsx
import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const HomeActionCard = ({ icon, title, onClick }) => {
  return (
    <Paper
      onClick={onClick}
      sx={{
        padding: 4,
        borderRadius: '12px',
        border: '2px solid',
        borderColor: 'secondary.main',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        bgcolor: 'white',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 6px 12px rgba(250, 88, 45, 0.2)',
          bgcolor: '#FFF5F3',
        },
      }}
    >
      <Box
        sx={{
          color: 'secondary.main',
          mb: 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: 'text.primary',
          fontSize: '18px',
        }}
      >
        {title}
      </Typography>
    </Paper>
  );
};

export default HomeActionCard;