// src/hooks/useSocket.js
import { useEffect, useRef, useCallback } from "react";
import { io }     from "socket.io-client";
import { create } from "zustand";

// ── Global socket store (singleton) ──────────────────────────────────────────
export const useSocketStore = create((set) => ({
  socket:    null,
  connected: false,
  setSocket: (s)    => set({ socket: s }),
  setConnected: (v) => set({ connected: v }),
}));

let _socket = null; // module-level singleton

export function useSocket() {
  const { socket, connected, setSocket, setConnected } = useSocketStore();

  useEffect(() => {
    if (_socket) return; // already initialised

    const token = localStorage.getItem("accessToken");
    _socket = io(import.meta.env.VITE_SOCKET_URL || "http://localhost:5000", {
      auth:            { token },
      transports:      ["websocket", "polling"],
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    _socket.on("connect",    () => setConnected(true));
    _socket.on("disconnect", () => setConnected(false));

    setSocket(_socket);

    return () => {
      // Don't disconnect on unmount — keep alive for the session
    };
  }, []);

  // Emit helper with optional callback
  const emit = useCallback((event, data, cb) => {
    if (_socket?.connected) _socket.emit(event, data, cb);
  }, []);

  // Subscribe helper — returns unsubscribe fn
  const on = useCallback((event, handler) => {
    _socket?.on(event, handler);
    return () => _socket?.off(event, handler);
  }, [socket]);

  return { socket: _socket, connected, emit, on };
}

export default useSocket;
