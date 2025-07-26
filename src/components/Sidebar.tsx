import React, { useState } from 'react';
import { Search, Plus, Settings, LogOut, Bot, Users } from 'lucide-react';
import { Chat, User } from '../types';

interface SidebarProps {
  currentUser: User;
  chats: Chat[];
  activeChat: Chat | null;
  onChatSelect: (chat: Chat) => void;
  onNewChat: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  chats,
  activeChat,
  onChatSelect,
  onNewChat,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter(chat =>
    chat.participants.some(participant =>
      participant.username.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    return `${days}d`;
  };

  return (
    <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-white">Messages</h1>
          <div className="flex items-center space-x-2">
            <button
              onClick={onNewChat}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="New Chat"
            >
              <Plus className="w-5 h-5 text-slate-400" />
            </button>
            <button
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.map((chat) => {
          const otherParticipant = chat.participants.find(p => p.id !== currentUser.id);
          const isActive = activeChat?.id === chat.id;

          return (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`p-4 border-b border-slate-800 cursor-pointer transition-colors ${
                isActive ? 'bg-purple-600/20 border-purple-500' : 'hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    {chat.isAIChat ? (
                      <Bot className="w-6 h-6 text-white" />
                    ) : (
                      <Users className="w-6 h-6 text-white" />
                    )}
                  </div>
                  {!chat.isAIChat && otherParticipant?.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-slate-900 rounded-full"></div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-white truncate">
                      {chat.isAIChat ? 'PrivateGPT' : otherParticipant?.username || 'Unknown'}
                    </h3>
                    {chat.lastMessage && (
                      <span className="text-xs text-slate-400">
                        {formatTime(chat.lastMessage.timestamp)}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400 truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {chat.unreadCount > 0 && (
                      <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {currentUser.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-white font-medium">{currentUser.username}</p>
              <p className="text-xs text-slate-400 truncate">{currentUser.principal}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </div>
  );
};