# ChatVid - Modern Chat + Video Platform

A production-ready frontend for a chat and video calling application built with React, TypeScript, Tailwind CSS, and WebRTC. Features real-time messaging, HD video calls, file sharing, and user management.

## 🚀 Features

- **Instant Room Creation**: Generate unique 6-character room codes
- **Real-time Chat**: WebSocket-powered messaging with typing indicators
- **HD Video Calls**: WebRTC peer-to-peer video communications
- **File Sharing**: Upload images, videos, and documents via Firebase Storage
- **User Management**: Guest access and full user accounts with friends system
- **Responsive Design**: Mobile-first design with glassmorphism effects
- **Dark Mode**: Beautiful dark theme with neon accents

## 🎨 Design System

The app uses a carefully crafted design system with these exact brand colors:

```css
:root {
  --sky-blue: #14ddda;      /* Primary actions & branding */
  --butter-cream: #fffbe8;  /* Text & light backgrounds */
  --charcoal-green: #2b3738; /* Dark backgrounds */
  --neon-red: #ff4655;      /* Alerts & destructive actions */
  --earth-brown: #5e3933;   /* Unused - available for expansion */
  --ocean-blue: #3291ab;    /* Unused - available for expansion */
  --toxic-mint: #03fcad;    /* Secondary actions & accents */
}
```

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design tokens
- **UI Components**: shadcn/ui with custom variants
- **Routing**: React Router v6
- **State Management**: React Context + hooks
- **Real-time**: Socket.io (client)
- **Video**: WebRTC with custom signaling
- **File Storage**: Firebase Storage
- **Forms**: React Hook Form with Zod validation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   ├── AppShell.tsx    # Main layout wrapper
│   ├── Navbar.tsx      # Top navigation
│   ├── Sidebar.tsx     # Room and friends sidebar
│   ├── ChatWindow.tsx  # Main chat interface
│   ├── MessageList.tsx # Message display
│   ├── MessageInput.tsx # Message composition
│   └── ...
├── pages/              # Route components
│   ├── Landing.tsx     # Marketing homepage
│   ├── Auth.tsx        # Sign in/up/guest
│   ├── CreateRoom.tsx  # Room creation flow
│   ├── JoinRoom.tsx    # Room joining flow
│   ├── Room.tsx        # Main chat room
│   ├── Call.tsx        # Video call interface
│   ├── Profile.tsx     # User dashboard
│   └── Users.tsx       # User directory
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx     # Authentication state
│   ├── useSocket.tsx   # WebSocket connection
│   └── useWebRTC.tsx   # Video call state
├── lib/                # Utilities and configuration
│   ├── socket-contract.ts # TypeScript event definitions
│   ├── design-tokens.ts   # Design system constants
│   ├── firebase.ts        # Firebase configuration
│   └── utils.ts
├── data/               # Mock data for demo
│   └── mock-data.ts    # Sample users, rooms, messages
└── styles/
    └── index.css       # Global styles and design system
```

## 🚦 Getting Started

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd chatvid
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Demo Mode**
   The app includes comprehensive mock data for immediate testing:
   - Try room codes: `ABC123`, `XYZ789`, `DEF456`
   - Demo login: `alice@example.com` with any password
   - Guest access: Use any display name

## 🔌 Backend Integration

### WebSocket Server Setup

The frontend expects a WebSocket server implementing the event contract defined in `src/lib/socket-contract.ts`:

```typescript
// Required socket events your server must handle:
server.on('connection', (socket) => {
  socket.on('createRoom', (payload: CreateRoomPayload) => {
    // Generate room code, create room, respond with room details
  });
  
  socket.on('joinRoom', (payload: JoinRoomPayload) => {
    // Validate room code, add user to room, broadcast presence
  });
  
  socket.on('message', (payload: MessagePayload) => {
    // Save message, broadcast to room participants
  });
  
  socket.on('typing', (payload: TypingPayload) => {
    // Broadcast typing status to other participants
  });
  
  // WebRTC signaling events
  socket.on('callOffer', (payload: CallOfferPayload) => {
    // Forward WebRTC offer to target peer
  });
  
  // ... see socket-contract.ts for complete event list
});
```

### Environment Variables

Create a `.env.local` file with:

```env
# WebSocket Server
VITE_WEBSOCKET_URL=ws://localhost:3001

# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com

# WebRTC Configuration
VITE_STUN_SERVER=stun:stun.l.google.com:19302
VITE_TURN_SERVER=turn:your-turn-server.com:3478
VITE_TURN_USERNAME=your_username
VITE_TURN_CREDENTIAL=your_password
```

### Firebase Storage Rules

Configure Firebase Storage with these security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload files
    match /files/{userId}/{fileName} {
      allow read: if true; // Public read access
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && resource == null // Only new files
                   && request.resource.size < 10 * 1024 * 1024; // 10MB limit
    }
    
    // Allow authenticated users to upload images
    match /images/{userId}/{fileName} {
      allow read: if true;
      allow write: if request.auth != null 
                   && request.auth.uid == userId
                   && request.resource.contentType.matches('image/.*')
                   && request.resource.size < 5 * 1024 * 1024; // 5MB limit
    }
  }
}
```

### WebRTC Considerations

For production deployment:

1. **STUN/TURN Servers**: Use services like Twilio, Xirsys, or self-hosted CoTURN
2. **HTTPS Required**: WebRTC requires secure context in production
3. **Firewall Configuration**: Ensure UDP ports are open for media streams
4. **Bandwidth Management**: Implement quality adaptation based on connection

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Run unit tests (when implemented)
npm run test

# Build for production
npm run build
```

## 📱 Mobile Support

The app is fully responsive and supports:
- Touch gestures for chat interactions
- Camera switching on mobile devices
- Optimized layouts for portrait/landscape
- PWA capabilities (can be added)

## 🎯 Production Deployment

1. **Build the app**
   ```bash
   npm run build
   ```

2. **Deploy to your platform**
   - Vercel: `vercel --prod`
   - Netlify: `netlify deploy --prod --dir=dist`
   - Firebase Hosting: `firebase deploy`

3. **Configure environment variables** on your deployment platform

## 🔒 Security Considerations

- **Input Sanitization**: All user inputs are sanitized before display
- **File Upload Validation**: File types and sizes are validated client-side and should be re-validated server-side
- **Rate Limiting**: Implement rate limiting on your WebSocket server
- **Authentication**: Use secure JWT tokens for user authentication
- **CORS Configuration**: Configure CORS appropriately for your domain

## 🚀 Performance Features

- **Code Splitting**: Lazy-loaded route components
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Analysis**: Use `npm run build-analyze` to analyze bundle size
- **Caching**: Static assets are cached with appropriate headers

## 🔧 Customization

### Brand Colors
Update colors in `src/index.css` and `tailwind.config.ts` to match your brand.

### UI Components
All shadcn/ui components can be customized in `src/components/ui/`

### Mock Data
Modify `src/data/mock-data.ts` to test different scenarios

## 📞 Support

- TypeScript interfaces in `src/lib/socket-contract.ts` provide complete API documentation
- All components are documented with TypeScript props
- Design tokens are available in `src/lib/design-tokens.ts`

## 📄 License

MIT License - feel free to use this codebase for your projects.

---

**Built with ❤️ using modern web technologies**