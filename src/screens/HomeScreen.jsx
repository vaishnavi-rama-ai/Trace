// screens/HomeScreen.jsx
import React, { useState } from 'react';
import { Box, Container, Paper, Typography, IconButton } from '@mui/material';
import { MessageCircle, Flame, MapPin, LogOut } from 'lucide-react';
import TraceLogo from '../components/TraceLogo';
import HomeActionCard from '../components/HomeActionCard';
import traceMoodImage from '../assets/trace-mood.jpeg';
import { COMMON_TYPOGRAPHY, COMMON_CONTAINER_STYLES } from '../theme/commonStyles';

const HomeScreen = ({ onLogout, onNavigateToChat, onNavigateToBurn, onNavigateToAnalysis }) => {
  const handleTraceMe = () => {
    onNavigateToAnalysis();
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
      <Box
        sx={{
          ...COMMON_CONTAINER_STYLES.header,
          padding: 2,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TraceLogo size={40} />
              <Typography variant="h1" sx={COMMON_TYPOGRAPHY.navTitle}>
                Trace
              </Typography>
            </Box>
            <IconButton onClick={onLogout} sx={{ color: 'text.primary' }}>
              <LogOut size={24} />
            </IconButton>
          </Box>
        </Container>
      </Box>

      {/* Content */}
      <Container maxWidth="md" sx={{ flex: 1, py: 4 }}>
        {/* Map Section */}
        <Paper
          sx={{
            height: '300px',
            mb: 4,
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#E8E3D8',
          }}
        >
          <Box
            component="img"
            src={traceMoodImage}
            alt="Trace Mood Map"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Paper>

        {/* Action Cards */}
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' },
            gap: 3,
          }}
        >
          <HomeActionCard
            icon={<MessageCircle size={40} />}
            title="Journal with Trace"
            onClick={onNavigateToChat}
          />
          <HomeActionCard
            icon={<Flame size={40} />}
            title="Burn Journal"
            onClick={onNavigateToBurn}
          />
          <HomeActionCard
            icon={<MapPin size={40} />}
            title="Trace Me"
            onClick={handleTraceMe}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default HomeScreen;