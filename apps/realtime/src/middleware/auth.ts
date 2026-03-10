import type { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  userRole?: string;
  userName?: string;
}

interface JWTPayload {
  id: string;
  role: string;
  name?: string;
  email?: string;
}

export function socketAuthMiddleware(
  socket: AuthenticatedSocket,
  next: (err?: Error) => void
): void {
  const token =
    socket.handshake.auth?.token ??
    socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Authentication required'));
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return next(new Error('Server configuration error'));
  }

  try {
    const decoded = jwt.verify(token, secret) as JWTPayload;
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    socket.userName = decoded.name ?? decoded.email ?? 'Anonymous';
    next();
  } catch {
    next(new Error('Invalid or expired token'));
  }
}
