import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FA9D84',
      dark: '#FA582D',
    },
    secondary: {
      main: '#FA582D',
    },
    background: {
      default: '#F5F0E8',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    h1: {
      fontFamily: 'Georgia, serif',
      fontWeight: 400,
    },
  },
});

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('login'); // 'login', 'register', 'home', 'chat'

  const handleLogin = () => {
    setCurrentScreen('home');
  };

  const handleRegister = () => {
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToChat = () => {
    setCurrentScreen('chat');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToRegister={handleNavigateToRegister}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegister={handleRegister}
          onNavigateToLogin={handleNavigateToLogin}
        />
      )}
      {currentScreen === 'home' && (
        <HomeScreen 
          onLogout={handleLogout} 
          onNavigateToChat={handleNavigateToChat}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen 
          onLogout={handleLogout}
          onBack={handleBackToHome}
        />
      )}
    </ThemeProvider>
  );
};

export default App;