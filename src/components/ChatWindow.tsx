import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { Chat, Message, User } from '../types';

interface ChatWindowProps {
  chat: Chat | null;
  currentUser: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
  onSendAIMessage: (content: string) => void;
  isAITyping: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  currentUser,
  messages,
  onSendMessage,
  onSendAIMessage,
  isAITyping,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showAIFeatures, setShowAIFeatures] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isAITyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    if (chat?.isAIChat) {
      onSendAIMessage(newMessage);
    } else {
      onSendMessage(newMessage);
    }
    
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bot className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">Welcome to PrivateICP Messenger</h3>
          <p className="text-slate-400">Select a conversation or start a new one</p>
        </div>
      </div>
    );
  }

  const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);

  return (
    <div className="flex-1 flex flex-col bg-slate-950">
      {/* Chat Header */}
      <div className="bg-slate-900 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              {chat.isAIChat ? (
                <Bot className="w-5 h-5 text-white" />
              ) : (
                <span className="text-white font-semibold">
                  {otherParticipant?.username.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-white">
                {chat.isAIChat ? 'PrivateGPT' : otherParticipant?.username}
              </h2>
              <p className="text-sm text-slate-400">
                {chat.isAIChat ? 'AI Assistant' : (otherParticipant?.isOnline ? 'Online' : 'Offline')}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {chat.isAIChat && (
              <button
                onClick={() => setShowAIFeatures(!showAIFeatures)}
                className={`p-2 rounded-lg transition-colors ${
                  showAIFeatures ? 'bg-purple-600 text-white' : 'hover:bg-slate-800 text-slate-400'
                }`}
                title="AI Features"
              >
                <Bot className="w-5 h-5" />
              </button>
            )}
            <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isFromCurrentUser = message.senderId === currentUser.id;
          
          return (
            <div
              key={message.id}
              className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                  isFromCurrentUser
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                    : chat.isAIChat
                    ? 'bg-slate-800 text-white border border-slate-600'
                    : 'bg-slate-800 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className={`text-xs ${
                    isFromCurrentUser ? 'text-purple-100' : 'text-slate-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </span>
                  {isFromCurrentUser && (
                    <span className={`text-xs ml-2 ${
                      message.status === 'read' ? 'text-green-300' :
                      message.status === 'delivered' ? 'text-blue-300' :
                      message.status === 'sent' ? 'text-purple-100' :
                      'text-yellow-300'
                    }`}>
                      {message.status === 'read' ? '✓✓' :
                       message.status === 'delivered' ? '✓✓' :
                       message.status === 'sent' ? '✓' : '○'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI Typing Indicator */}
        {isAITyping && (
          <div className="flex justify-start">
            <div className="bg-slate-800 border border-slate-600 px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-xs text-slate-400 ml-2">PrivateGPT is typing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-slate-900 border-t border-slate-700 p-4">
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-slate-400" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={chat.isAIChat ? "Ask PrivateGPT anything..." : "Type a message..."}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <Smile className="w-5 h-5 text-slate-400" />
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all duration-200"
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};