import { io, Socket } from 'socket.io-client';
let socket: Socket | null = null;
export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5002', {
      auth: { token: typeof window!=='undefined' ? localStorage.getItem('gj_access') : null },
      transports: ['websocket','polling'], autoConnect: false,
    });
  }
  return socket;
}
export function connectSocket(token?: string): Socket {
  const s = getSocket();
  if (token) (s as any).auth = { token };
  if (!s.connected) s.connect();
  return s;
}
export function disconnectSocket() { socket?.disconnect(); socket = null; }
