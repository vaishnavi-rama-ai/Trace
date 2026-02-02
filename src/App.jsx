// App.jsx (updated to include BurnJournalScreen)
import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import StartScreen from './screens/StartScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';
import BurnJournalScreen from './screens/BurnJournalScreen';
import AnalysisScreen from './screens/AnalysisScreen';

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
      secondary: '#666666',
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
  const [currentScreen, setCurrentScreen] = useState('start'); // 'start', 'login', 'register', 'home', 'chat', 'burn', 'analysis'
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  // Load user and token from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('access_token');
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
      setCurrentScreen('home');
    }
  }, []);

  const handleLogin = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', authToken);
    setCurrentScreen('home');
  };

  const handleRegister = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('access_token', authToken);
    setCurrentScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
    setCurrentScreen('start');
  };

  const handleNavigateToChat = () => {
    setCurrentScreen('chat');
  };

  const handleNavigateToBurn = () => {
    setCurrentScreen('burn');
  };

  const handleNavigateToAnalysis = () => {
    setCurrentScreen('analysis');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleNavigateToLogin = () => {
    setCurrentScreen('login');
  };

  const handleNavigateToRegister = () => {
    setCurrentScreen('register');
  };

  const handleBackToStart = () => {
    setCurrentScreen('start');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {currentScreen === 'start' && (
        <StartScreen 
          onNavigateToLogin={handleNavigateToLogin}
          onNavigateToRegister={handleNavigateToRegister}
        />
      )}
      {currentScreen === 'login' && (
        <LoginScreen 
          onLogin={handleLogin} 
          onNavigateToRegister={handleNavigateToRegister}
          onBack={handleBackToStart}
        />
      )}
      {currentScreen === 'register' && (
        <RegisterScreen 
          onRegister={handleRegister}
          onNavigateToLogin={handleNavigateToLogin}
          onBack={handleBackToStart}
        />
      )}
      {currentScreen === 'home' && (
        <HomeScreen 
          onLogout={handleLogout} 
          onNavigateToChat={handleNavigateToChat}
          onNavigateToBurn={handleNavigateToBurn}
          onNavigateToAnalysis={handleNavigateToAnalysis}
          user={user}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen 
          onLogout={handleLogout}
          onBack={handleBackToHome}
          user={user}
          token={token}
        />
      )}
      {currentScreen === 'burn' && (
        <BurnJournalScreen
          onLogout={handleLogout}
          onBack={handleBackToHome}
          user={user}
          token={token}
        />
      )}
      {currentScreen === 'analysis' && (
        <AnalysisScreen
          onLogout={handleLogout}
          onBack={handleBackToHome}
          user={user}
          token={token}
        />
      )}
    </ThemeProvider>
  );
};

export default App;