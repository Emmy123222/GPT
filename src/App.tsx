import React, { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { useAuth } from './hooks/useAuth';
import { EncryptionService } from './services/encryption';
import { GroqCloudService } from './services/groqcloud';
import { Chat, Message, User } from './types';

function App() {
  const { isAuthenticated, principal, loading, login, logout } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isAITyping, setIsAITyping] = useState(false);
  
  const encryptionService = EncryptionService.getInstance();
  const groqService = GroqCloudService.getInstance();

  // Current user
  const currentUser: User = {
    id: principal || 'anonymous',
    principal: principal || '',
    username: `User_${principal?.slice(0, 8) || 'Anonymous'}`,
    isOnline: true,
  };

  useEffect(() => {
    if (isAuthenticated) {
      initializeApp();
    }
  }, [isAuthenticated]);

  const initializeApp = async () => {
    try {
      // Generate encryption keys
      await encryptionService.generateKeyPair();
      
      // Initialize with AI chat
      const aiChat: Chat = {
        id: 'ai-chat',
        participants: [
          currentUser,
          {
            id: 'privategpt',
            principal: 'ai-assistant',
            username: 'PrivateGPT',
            isOnline: true,
          }
        ],
        unreadCount: 0,
        isAIChat: true,
      };

      setChats([aiChat]);
      setActiveChat(aiChat);
    } catch (error) {
      console.error('App initialization error:', error);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!activeChat) return;

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      recipientId: activeChat.participants.find(p => p.id !== currentUser.id)?.id || '',
      content,
      timestamp: new Date(),
      encrypted: false,
      messageType: 'text',
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);

    // Update chat's last message
    setChats(prev => prev.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, lastMessage: newMessage }
        : chat
    ));
  };

  const handleSendAIMessage = async (content: string) => {
    if (!activeChat?.isAIChat) return;

    // Add user message
    const userMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      recipientId: 'privategpt',
      content,
      timestamp: new Date(),
      encrypted: false,
      messageType: 'text',
      status: 'sent',
    };

    setMessages(prev => [...prev, userMessage]);
    setIsAITyping(true);

    try {
      // Get conversation history for context
      const conversationHistory = messages
        .slice(-10) // Last 10 messages for context
        .map(msg => `${msg.senderId === currentUser.id ? 'User' : 'Assistant'}: ${msg.content}`);

      // Generate AI response
      const aiResponse = await groqService.generateAIResponse(content, conversationHistory);

      // Add AI response
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: 'privategpt',
        recipientId: currentUser.id,
        content: aiResponse,
        timestamp: new Date(),
        encrypted: false,
        messageType: 'text',
        status: 'sent',
      };

      setMessages(prev => [...prev, aiMessage]);

      // Update chat's last message
      setChats(prev => prev.map(chat => 
        chat.id === activeChat.id 
          ? { ...chat, lastMessage: aiMessage }
          : chat
      ));
    } catch (error) {
      console.error('AI response error:', error);
      
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        senderId: 'privategpt',
        recipientId: currentUser.id,
        content: 'I apologize, but I\'m having trouble processing your request right now. Please try again later.',
        timestamp: new Date(),
        encrypted: false,
        messageType: 'text',
        status: 'sent',
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  const handleChatSelect = (chat: Chat) => {
    setActiveChat(chat);
    // Load messages for this chat (in real app, fetch from canister)
    setMessages([]);
  };

  const handleNewChat = () => {
    // TODO: Implement new chat creation
    console.log('New chat requested');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen onLogin={login} loading={loading} />;
  }

  return (
    <div className="h-screen bg-slate-950 flex">
      <Sidebar
        currentUser={currentUser}
        chats={chats}
        activeChat={activeChat}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
        onLogout={logout}
      />
      <ChatWindow
        chat={activeChat}
        currentUser={currentUser}
        messages={messages}
        onSendMessage={handleSendMessage}
        onSendAIMessage={handleSendAIMessage}
        isAITyping={isAITyping}
      />
    </div>
  );
}

export default App;