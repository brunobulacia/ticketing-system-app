import { io, type Socket } from 'socket.io-client';
import { API_URL } from '../api/client';

let socket: Socket | null = null;

/** Conexión WebSocket autenticada (FR-033). Patrón Singleton. */
export function connectSocket(token: string): Socket {
  if (socket?.connected) return socket;
  socket?.disconnect();
  socket = io(`${API_URL}/ws`, {
    auth: { token },
    transports: ['websocket'],
  });
  return socket;
}

export function getSocket(): Socket | null {
  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}
