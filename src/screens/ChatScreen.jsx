// screens/ChatScreen.jsx
import React, { useState, useEffect } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemText, Typography, Divider, IconButton, Paper } from '@mui/material';
import { Plus, Trash2 } from 'lucide-react';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import LoadingDots from '../components/LoadingDots';

const BACKEND_URL = 'http://localhost:3001';

const ChatScreen = ({ onLogout, onBack, user, token }) => {
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Define createNewChat function for the "+" button
  const createNewChat = async () => {
    try {
      // Create session in backend to get random prompt
      const response = await fetch(`${BACKEND_URL}/api/chat-sessions/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to create chat session');
      }

      const data = await response.json();
      const sessionId = data.session_id;

      // Fetch the greeting message that was created with the session
      const historyResponse = await fetch(
        `${BACKEND_URL}/api/chat-history/${sessionId}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      let greetingMessage = "Hi! I'm Trace, your journaling companion. How are you feeling today?";
      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        if (historyData.messages && historyData.messages.length > 0) {
          greetingMessage = historyData.messages[0].ai_response;
        }
      }

      const newChat = {
        id: Math.max(...chats.map(c => c.id), 0) + 1,
        title: 'New Chat',
        sessionId: sessionId,
        messages: [
          {
            id: 1,
            text: greetingMessage,
            sender: 'trace',
          },
        ],
        createdAt: new Date(data.created_at),
        loaded: true,
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    } catch (error) {
      console.error('Error creating new chat:', error);
      // Fallback: create empty chat locally
      const newChat = {
        id: Math.max(...chats.map(c => c.id), 0) + 1,
        title: 'New Chat',
        sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        messages: [],
        createdAt: new Date(),
        loaded: true,
      };
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
    }
  };

  // Fetch existing chat sessions on mount
  useEffect(() => {
    const fetchChatSessions = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/chat-sessions`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.sessions && data.sessions.length > 0) {
            // Transform sessions into chat format
            const loadedChats = data.sessions.map((session, index) => ({
              id: index + 1,
              title: session.title,
              sessionId: session.session_id,
              messages: [],
              createdAt: new Date(session.created_at),
              loaded: false, // Track if messages are loaded
            }));
            
            setChats(loadedChats);
            setCurrentChatId(1); // Select first chat
          } else {
            // No existing sessions, create an empty default one
            const defaultChat = {
              id: 1,
              title: 'New Chat',
              sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              messages: [],
              createdAt: new Date(),
              loaded: true,
            };
            setChats([defaultChat]);
            setCurrentChatId(1);
          }
        } else {
          // If API fails, create an empty default one
          const defaultChat = {
            id: 1,
            title: 'New Chat',
            sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            messages: [],
            createdAt: new Date(),
            loaded: true,
          };
          setChats([defaultChat]);
          setCurrentChatId(1);
        }
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
        // If error, create an empty default one
        const defaultChat = {
          id: 1,
          title: 'New Chat',
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          messages: [],
          createdAt: new Date(),
          loaded: true,
        };
        setChats([defaultChat]);
        setCurrentChatId(1);
      } finally {
        setLoading(false);
      }
    };

    fetchChatSessions();
  }, [token]);

  // Fetch messages for current chat when it changes
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (!currentChatId || !token) return;

      const currentChatData = chats.find((chat) => chat.id === currentChatId);
      if (!currentChatData || currentChatData.loaded || currentChatData.messages.length > 0) return;

      try {
        const response = await fetch(
          `${BACKEND_URL}/api/chat-history/${currentChatData.sessionId}`,
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          
          // Convert messages to frontend format
          const messages = [];
          data.messages.forEach((entry, index) => {
            // Skip empty user messages (these are session creation entries)
            if (entry.user_message.trim()) {
              messages.push({
                id: index * 2 + 1,
                text: entry.user_message,
                sender: 'user',
              });
            }
            messages.push({
              id: entry.user_message.trim() ? index * 2 + 2 : index * 2 + 1,
              text: entry.ai_response,
              sender: 'trace',
            });
          });

          setChats((prevChats) =>
            prevChats.map((chat) =>
              chat.id === currentChatId
                ? {
                    ...chat,
                    messages: messages,
                    loaded: true,
                  }
                : chat
            )
          );
        }
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatMessages();
  }, [currentChatId, token, chats]);

  const currentChat = chats.find((chat) => chat.id === currentChatId);

  const handleSendMessage = async (messageText) => {
    if (messageText.trim() && currentChat && !sending) {
      // Add user message to current chat
      const userMessage = {
        id: (currentChat.messages.length || 0) + 1,
        text: messageText,
        sender: 'user',
      };

      // Update chat with user message
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [...chat.messages, userMessage],
                title: chat.title === 'New Chat' ? messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '') : chat.title,
              }
            : chat
        )
      );

      // Add loading indicator
      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat.id === currentChatId
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  {
                    id: chat.messages.length + 1,
                    text: 'loading',
                    sender: 'trace',
                  },
                ],
              }
            : chat
        )
      );

      setSending(true);

      try {
        // Call backend API with authentication
        const response = await fetch(`${BACKEND_URL}/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: messageText,
            session_id: currentChat.sessionId,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`Backend error: ${errorData.detail || response.status}`);
        }

        const data = await response.json();

        // Add trace response to current chat
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, idx) =>
                    idx === chat.messages.length - 1 && msg.text === 'loading'
                      ? {
                          ...msg,
                          text: data.response,
                        }
                      : msg
                  ),
                }
              : chat
          )
        );
      } catch (error) {
        console.error('Error calling backend:', error);
        // Replace loading indicator with error message
        setChats((prevChats) =>
          prevChats.map((chat) =>
            chat.id === currentChatId
              ? {
                  ...chat,
                  messages: chat.messages.map((msg, idx) =>
                    idx === chat.messages.length - 1 && msg.text === 'loading'
                      ? {
                          ...msg,
                          text: "Sorry, I couldn't process that. Please try again.",
                        }
                      : msg
                  ),
                }
              : chat
          )
        );
      } finally {
        setSending(false);
      }
    }
  };

  const handleNewChat = () => {
    createNewChat();
  };

  const handleSelectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const handleDeleteChat = async (chatId, e) => {
    e.stopPropagation();
    
    const chatToDelete = chats.find((chat) => chat.id === chatId);
    if (!chatToDelete) return;

    // Delete from database
    try {
      console.log(`Deleting chat with sessionId: ${chatToDelete.sessionId}`);
      const response = await fetch(
        `${BACKEND_URL}/api/chat-sessions/${chatToDelete.sessionId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      console.log(`Delete response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Failed to delete chat from database:', response.status, errorData);
        alert('Failed to delete chat from database. Please try again.');
        return;
      }

      const responseData = await response.json();
      console.log('Delete successful:', responseData);
    } catch (error) {
      console.error('Error deleting chat from database:', error);
      alert('Error deleting chat. Please try again.');
      return;
    }

    // Only remove from UI if deletion was successful
    if (chats.length === 1) {
      // Don't delete if it's the only chat, just reset it
      setChats([
        {
          id: 1,
          title: 'New Chat',
          messages: [],
          sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date(),
          loaded: true,
        },
      ]);
      setCurrentChatId(1);
    } else {
      const newChats = chats.filter((chat) => chat.id !== chatId);
      setChats(newChats);
      if (currentChatId === chatId) {
        setCurrentChatId(newChats[0].id);
      }
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
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
      <ChatHeader onLogout={onLogout} onBack={onBack} />

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Sidebar - Always Visible */}
        <Paper
          elevation={0}
          sx={{
            width: { xs: '280px', sm: '320px' },
            borderRight: '2px solid',
            borderColor: 'primary.main',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'white',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'Georgia, serif',
                fontWeight: 400,
                color: 'text.primary',
              }}
            >
              Journal Entries
            </Typography>
          </Box>

          <Divider />

          <List sx={{ 
            flex: 1, 
            overflow: 'auto', 
            px: 1, 
            py: 2,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              bgcolor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: '#D0D0D0',
              borderRadius: '4px',
              '&:hover': {
                bgcolor: '#B0B0B0',
              },
            },
          }}>
            {chats.map((chat) => (
              <ListItem
                key={chat.id}
                disablePadding
                sx={{ mb: 1 }}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={(e) => handleDeleteChat(chat.id, e)}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': {
                        color: 'error.main',
                      },
                    }}
                  >
                    <Trash2 size={18} />
                  </IconButton>
                }
              >
                <ListItemButton
                  selected={chat.id === currentChatId}
                  onClick={() => handleSelectChat(chat.id)}
                  sx={{
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: chat.id === currentChatId ? 'secondary.main' : 'transparent',
                    bgcolor: chat.id === currentChatId ? '#FFF5F3' : 'transparent',
                    '&:hover': {
                      bgcolor: chat.id === currentChatId ? '#FFF5F3' : '#F5F0E8',
                    },
                    mr: 1,
                  }}
                >
                  <ListItemText
                    primary={chat.title}
                    secondary={formatDate(chat.createdAt)}
                    primaryTypographyProps={{
                      noWrap: true,
                      fontWeight: chat.id === currentChatId ? 600 : 400,
                      fontSize: '14px',
                    }}
                    secondaryTypographyProps={{
                      fontSize: '12px',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Main Chat Area */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <MessageList messages={currentChat?.messages || []} />
          <MessageInput 
            onSendMessage={handleSendMessage} 
            isLoading={sending}
            onNewChat={handleNewChat}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ChatScreen;