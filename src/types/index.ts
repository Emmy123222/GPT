export interface User {
  id: string;
  principal: string;
  publicKey?: string;
  username: string;
  avatar?: string;
  lastSeen?: Date;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;
  encrypted: boolean;
  messageType: 'text' | 'image' | 'file';
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  isAIChat: boolean;
}

export interface AIResponse {
  id: string;
  type: 'summary' | 'reply' | 'suggestion';
  content: string;
  timestamp: Date;
  confidence: number;
}

export interface EncryptionKeys {
  publicKey: CryptoKey;
  privateKey: CryptoKey;
}