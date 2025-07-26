# PrivateICP Messenger 🔐

A privacy-centric, AI-enhanced messaging application built on the Internet Computer Protocol (ICP). Features end-to-end encryption, decentralized architecture, and intelligent AI assistant capabilities powered by GroqCloud.

## 🌟 Features

- **🔒 End-to-End Encryption**: Messages encrypted using ECDH key exchange + AES-GCM
- **🤖 AI Assistant**: PrivateGPT powered by GroqCloud's Llama 3 models
- **🌐 Decentralized**: Built on Internet Computer Protocol (ICP)
- **🔑 Internet Identity**: Secure, passwordless authentication
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **⚡ Real-time**: Instant messaging with typing indicators
- **🎯 Zero Knowledge**: No personal data stored on servers

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    PrivateICP Messenger Architecture            │
└─────────────────────────────────────────────────────────────────┘

                    ┌──────────────────────┐
                    │   Internet Identity  │
                    │    (ICP Native)      │
                    └──────────┬───────────┘
                               │ Authentication
                               ▼
┌──────────────────────────────────────────────────────────────────┐
│                     Frontend Layer                               │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │   React     │  │  TypeScript │  │  Tailwind   │              │
│  │   18.3.1    │  │    5.5.3    │  │    CSS      │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Encrypted Messages
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                   Encryption Layer                               │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Web Crypto API (Browser Native)                           │ │
│  │  • ECDH Key Exchange (P-256 Curve)                        │ │
│  │  • AES-GCM Symmetric Encryption                           │ │
│  │  • Secure Random IV Generation                            │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────┬───────────────────────────────────────────┘
                       │ Ciphertext Only
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    ICP Canister Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │    Chat     │  │   Storage   │  │    User     │              │
│  │  Canister   │  │  Canister   │  │  Registry   │              │
│  │  (Motoko)   │  │  (Rust)     │  │ (Motoko)    │              │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└──────────────────────┬───────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                    AI Enhancement Layer                          │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   GroqCloud API                             │ │
│  │  • Model: llama3-8b-8192                                   │ │
│  │  • Chat Summarization                                      │ │
│  │  • Smart Reply Suggestions                                 │ │
│  │  • Conversational AI Assistant                             │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
```

## 🔄 Data Flow Diagram

```
User A                                                    User B
  │                                                         │
  │ 1. Generate Key Pair                                    │
  ▼                                                         ▼
┌─────────────────┐                                 ┌─────────────────┐
│  Private Key A  │                                 │  Private Key B  │
│  Public Key A   │                                 │  Public Key B   │
└─────────────────┘                                 └─────────────────┘
  │                                                         │
  │ 2. Exchange Public Keys via ICP                        │
  ▼                                                         ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    ICP Public Key Registry                          │
│  store_public_key(user_a, public_key_a)                            │
│  store_public_key(user_b, public_key_b)                            │
└─────────────────────────────────────────────────────────────────────┘
  │                                                         │
  │ 3. Derive Shared Secret (ECDH)                         │
  ▼                                                         ▼
┌─────────────────┐                                 ┌─────────────────┐
│ Shared Secret A │ ◄─────────────────────────────► │ Shared Secret B │
│ (Same Value)    │                                 │ (Same Value)    │
└─────────────────┘                                 └─────────────────┘
  │                                                         │
  │ 4. Encrypt Message with AES-GCM                        │
  ▼                                                         │
┌─────────────────┐                                        │
│   "Hello Bob"   │                                        │
│       ▼         │                                        │
│  [Ciphertext]   │                                        │
└─────────────────┘                                        │
  │                                                         │
  │ 5. Send via ICP Canister                               │
  ▼                                                         │
┌─────────────────────────────────────────────────────────────────────┐
│                      Chat Canister                                  │
│  send_message(sender_id, recipient_id, ciphertext, timestamp)       │
└─────────────────────────────────────────────────────────────────────┘
                                    │                       │
                                    │ 6. Retrieve Messages  │
                                    ▼                       ▼
                              ┌─────────────────┐   ┌─────────────────┐
                              │  [Ciphertext]   │   │  [Ciphertext]   │
                              │       ▼         │   │       ▼         │
                              │  "Hello Bob"    │   │  "Hello Bob"    │
                              └─────────────────┘   └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Internet connection for GroqCloud API
- Modern browser with Web Crypto API support

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd privateicp-messenger
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your GroqCloud API key:
   ```env
   VITE_GROQCLOUD_API_KEY=your_groqcloud_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting GroqCloud API Key

1. Visit [GroqCloud Console](https://console.groq.com)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key to your `.env` file (replace `your_groqcloud_api_key_here`)

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── LoginScreen.tsx   # Internet Identity login
│   ├── Sidebar.tsx       # Chat list and user profile
│   └── ChatWindow.tsx    # Main chat interface
├── hooks/               # Custom React hooks
│   └── useAuth.ts       # Authentication logic
├── services/            # External services
│   ├── encryption.ts    # End-to-end encryption
│   └── groqcloud.ts     # AI assistant integration
├── types/               # TypeScript definitions
│   └── index.ts         # Core type definitions
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── index.css            # Global styles
```

## 🔐 Security Architecture

### Encryption Flow

1. **Key Generation**: Each user generates an ECDH key pair using P-256 curve
2. **Key Exchange**: Public keys are stored in ICP canister registry
3. **Shared Secret**: ECDH algorithm derives identical shared secrets
4. **Message Encryption**: AES-GCM encrypts messages with derived key
5. **Secure Storage**: Only ciphertext is stored on-chain

### Security Features

- **Zero Knowledge**: Server never sees plaintext messages
- **Forward Secrecy**: New keys can be generated for each session
- **Authenticated Encryption**: AES-GCM provides both confidentiality and integrity
- **Secure Random**: Cryptographically secure random number generation
- **Browser Native**: Uses Web Crypto API (no external crypto libraries)

## 🤖 AI Assistant Features

### PrivateGPT Capabilities

- **Conversational AI**: Natural language conversations
- **Context Awareness**: Remembers conversation history
- **Smart Replies**: Suggests contextual responses
- **Chat Summarization**: Summarizes long conversations
- **Privacy Focused**: No data stored by AI service

### GroqCloud Integration

```typescript
// Example AI service usage
const groqService = GroqCloudService.getInstance();

// Generate AI response
const response = await groqService.generateAIResponse(
  userMessage, 
  conversationHistory
);

// Get smart reply suggestions
const suggestions = await groqService.generateSmartReplies(
  lastMessage, 
  context
);

// Summarize conversation
const summary = await groqService.summarizeConversation(messages);
```

## 🌐 ICP Integration

### Internet Identity Authentication

```typescript
// Authentication flow
const authClient = await AuthClient.create();
await authClient.login({
  identityProvider: 'https://identity.ic0.app',
  onSuccess: () => {
    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();
    // User is now authenticated
  }
});
```

### Canister Architecture (Future Implementation)

```motoko
// Chat Canister (Motoko)
actor ChatCanister {
  public func send_message(
    sender: Principal,
    recipient: Principal, 
    ciphertext: Text,
    timestamp: Int
  ) : async MessageId;
  
  public func get_messages(
    user1: Principal,
    user2: Principal
  ) : async [Message];
  
  public func store_public_key(
    user: Principal,
    public_key: Text
  ) : async Bool;
}
```

## 🎨 UI/UX Design

### Design System

- **Color Palette**: Dark theme with purple/blue accents
- **Typography**: System fonts with proper hierarchy
- **Spacing**: 8px grid system
- **Components**: Modular, reusable components
- **Animations**: Smooth transitions and micro-interactions

### Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px  
- **Desktop**: 1024px+

### Accessibility

- **WCAG 2.1 AA**: Compliant color contrast ratios
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels
- **Focus Management**: Visible focus indicators

## 🧪 Testing Strategy

### Unit Tests
```bash
npm run test
```

### E2E Test Scenarios

1. **Authentication Flow**
   - Login with Internet Identity
   - Session persistence
   - Logout functionality

2. **Messaging Flow**
   - Send encrypted message
   - Receive and decrypt message
   - Message status updates

3. **AI Assistant Flow**
   - Send message to PrivateGPT
   - Receive AI response
   - Smart reply suggestions

## 🚀 Deployment

### Frontend Deployment

```bash
# Build for production
npm run build

# Deploy to IC asset canister
dfx deploy --network ic frontend
```

### Canister Deployment

```bash
# Deploy all canisters
dfx deploy --network ic

# Deploy specific canister
dfx deploy --network ic chat_canister
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

```env
# Required
VITE_GROQCLOUD_API_KEY=your_api_key

# Optional (for local development)
VITE_IC_HOST=http://localhost:4943
VITE_INTERNET_IDENTITY_URL=http://localhost:4943/?canisterId=...
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Internet Computer Protocol** - Decentralized infrastructure
- **GroqCloud** - High-performance AI inference
- **Web Crypto API** - Browser-native encryption
- **React Team** - Frontend framework
- **Tailwind CSS** - Utility-first CSS framework


---

**Built with  for privacy and decentralization**