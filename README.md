# Chaty Frontend

Chaty is a web application for real-time chat that helps users run private conversations in real time on the web. This app connects to a backend API + Socket.IO for conversation sync, message status, and online activity. And this also uses WebRTC for private call feature.

## Tech Stack
- React 19
- TypeScript
- Vite
- ShadCN + Tailwind CSS v4
- TanStack Router
- TanStack Query + Axios
- TanStack Form + Zod
- TanStack Virtual
- Zustand
- Socket.IO Client
- Firebase Cloud Messaging

## Configuration
### 1. Prerequisites
- Node.js 20+
- pnpm 9+ (or you can use your own package manager)

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up environment variables
Create a `.env` file in the project root, then fill it using the example in [`.env.example`](#env-example).

### 4. Run the project
```bash
pnpm dev
```
The app will run on the default Vite URL (usually `http://localhost:5173`).

### 5. Production build
```bash
pnpm build
pnpm preview
```

### 6. Important configuration notes
- API base URL is read from `VITE_API_BASE_URL`.
- Socket server is currently configured in `src/lib/socket.ts` to `http://localhost:3000`.
- Web push notifications require valid Firebase configuration + VAPID key.

## Env Example
```env
VITE_APP_MODE=development
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Storage Keys
VITE_AUTH_STORAGE_KEY=chaty-auth-storage
VITE_PRIVATE_CONVERSATION_STORAGE_KEY=chaty-private-conversation-storage
VITE_PUSH_TOKEN_STORAGE_KEY=chaty-push-token-storage
VITE_THEME_STORAGE_KEY=chaty-theme-storage
VITE_PRIVATE_CALL_STORAGE_KEY=chaty-private-call-storage

# Firebase (use values from your own Firebase project)
VITE_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VITE_FIREBASE_VAPID_KEY=YOUR_FIREBASE_VAPID_KEY
```

## Features
- User login
- Real-time private chat (Socket.IO)
- Conversation list + conversation search
- Infinite scroll and virtualized list for message/conversation performance
- Send text messages
- Send file attachments
- Record and send voice notes
- Read indicator and unread badge
- User online status / last seen
- Private audio calls (WebRTC)
- Web push notifications (Firebase Cloud Messaging)
- Theme toggle
