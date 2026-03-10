import type { Server } from 'socket.io';
import type { AuthenticatedSocket } from '../middleware/auth';

interface ChatMessage {
  id: string;
  fromId: string;
  fromName: string;
  courseId: string;
  content: string;
  createdAt: string;
}

interface JoinCoursePayload {
  courseId: string;
}

interface SendMessagePayload {
  courseId: string;
  content: string;
}

export function registerChatHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Join a course chat room
  socket.on('chat:join', ({ courseId }: JoinCoursePayload) => {
    if (!courseId) return;
    socket.join(`course:${courseId}:chat`);
    socket.emit('chat:joined', { courseId });
    console.log(`[chat] ${socket.userName} joined course:${courseId}`);
  });

  // Leave a course chat room
  socket.on('chat:leave', ({ courseId }: JoinCoursePayload) => {
    if (!courseId) return;
    socket.leave(`course:${courseId}:chat`);
    console.log(`[chat] ${socket.userName} left course:${courseId}`);
  });

  // Send a chat message
  socket.on('chat:send', ({ courseId, content }: SendMessagePayload) => {
    if (!courseId || !content?.trim()) return;
    if (!socket.userId) return;

    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      fromId: socket.userId,
      fromName: socket.userName ?? 'Anonymous',
      courseId,
      content: content.trim(),
      createdAt: new Date().toISOString(),
    };

    // Broadcast to all members of the course chat room
    io.to(`course:${courseId}:chat`).emit('chat:message', message);

    // In production: persist message to MongoDB via a REST call or direct DB write
  });

  // Typing indicator
  socket.on('chat:typing', ({ courseId }: JoinCoursePayload) => {
    if (!courseId || !socket.userId) return;
    socket.to(`course:${courseId}:chat`).emit('chat:typing', {
      userId: socket.userId,
      userName: socket.userName,
    });
  });
}
