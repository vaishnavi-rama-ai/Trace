// screens/HomeScreen.jsx
import React from 'react';
import { Box, Container, Paper, Typography, IconButton } from '@mui/material';
import { MessageCircle, Flame, MapPin, LogOut } from 'lucide-react';
import TraceLogo from '../components/TraceLogo';
import HomeActionCard from '../components/HomeActionCard';

const HomeScreen = ({ onLogout, onNavigateToChat }) => {
  const handleBurnJournal = () => {
    console.log('Burn Journal clicked');
    // Add your burn journal logic here
  };

  const handleTraceMe = () => {
    console.log('Trace Me clicked');
    // Add your trace me logic here
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
          bgcolor: 'primary.main',
          padding: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <TraceLogo size={40} />
              <Typography
                variant="h1"
                sx={{
                  fontSize: '28px',
                  fontFamily: 'Georgia, serif',
                  m: 0,
                  color: 'text.primary',
                  fontWeight: 400,
                }}
              >
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
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <MapPin size={48} color="#FA582D" />
            <Typography variant="body1" sx={{ mt: 2, color: 'text.primary' }}>
              Map will appear here
            </Typography>
          </Box>
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
            title="Chat with Trace"
            onClick={onNavigateToChat}
          />
          <HomeActionCard
            icon={<Flame size={40} />}
            title="Burn Journal"
            onClick={handleBurnJournal}
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