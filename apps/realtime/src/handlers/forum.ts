import type { Server } from 'socket.io';
import type { AuthenticatedSocket } from '../middleware/auth';

interface JoinForumPayload {
  courseId: string;
}

interface NewPostPayload {
  courseId: string;
  postId: string;
  title: string;
  authorId: string;
  authorName: string;
}

interface NewReplyPayload {
  courseId: string;
  postId: string;
  replyId: string;
  authorId: string;
  authorName: string;
  content: string;
}

export function registerForumHandlers(io: Server, socket: AuthenticatedSocket): void {
  // Join a course forum room
  socket.on('forum:join', ({ courseId }: JoinForumPayload) => {
    if (!courseId) return;
    socket.join(`course:${courseId}:forum`);
    console.log(`[forum] ${socket.userName} joined forum for course:${courseId}`);
  });

  // Leave a course forum room
  socket.on('forum:leave', ({ courseId }: JoinForumPayload) => {
    if (!courseId) return;
    socket.leave(`course:${courseId}:forum`);
  });

  // Notify when a new post is created (emitted by server after REST API creates it)
  socket.on('forum:new_post', (payload: NewPostPayload) => {
    if (!payload.courseId || !socket.userId) return;
    io.to(`course:${payload.courseId}:forum`).emit('forum:post_created', {
      ...payload,
      createdAt: new Date().toISOString(),
    });
  });

  // Notify when a new reply is added
  socket.on('forum:new_reply', (payload: NewReplyPayload) => {
    if (!payload.courseId || !socket.userId) return;
    io.to(`course:${payload.courseId}:forum`).emit('forum:reply_created', {
      ...payload,
      createdAt: new Date().toISOString(),
    });
  });
}
