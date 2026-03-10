import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import helmet from 'helmet';
import { socketAuthMiddleware, type AuthenticatedSocket } from './middleware/auth';
import { registerChatHandlers } from './handlers/chat';
import { registerForumHandlers } from './handlers/forum';

const PORT = parseInt(process.env.PORT ?? '3001', 10);
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000';

// ─── Express App ─────────────────────────────────────────────────────────────

const app = express();

app.use(helmet());
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── HTTP Server + Socket.io ──────────────────────────────────────────────────

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Auth middleware for all socket connections
io.use(socketAuthMiddleware);

// ─── Socket Connections ───────────────────────────────────────────────────────

io.on('connection', (socket) => {
  const authedSocket = socket as AuthenticatedSocket;
  console.log(`[socket] connected: ${authedSocket.userName} (${authedSocket.userId})`);

  // Register event handlers
  registerChatHandlers(io, authedSocket);
  registerForumHandlers(io, authedSocket);

  socket.on('disconnect', (reason) => {
    console.log(`[socket] disconnected: ${authedSocket.userName} — ${reason}`);
  });

  socket.on('error', (err) => {
    console.error(`[socket] error from ${authedSocket.userName}:`, err.message);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────

httpServer.listen(PORT, () => {
  console.log(`[realtime] server running on port ${PORT}`);
  console.log(`[realtime] cors origin: ${CORS_ORIGIN}`);
});

export default app;
