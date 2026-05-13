// src/store/roomStore.js
import { create } from "zustand";

const useRoomStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  room:      null,         // full Room document from server
  roomCode:  null,
  players:   [],
  messages:  [],           // chat messages
  myReady:   false,
  isHost:    false,
  phase:     "idle",       // idle | waiting | starting | active | finished
  countdown: null,         // 3-2-1 before game start
  results:   null,         // end-game results array

  // ── Room actions ───────────────────────────────────────────────────────
  setRoom: (room, myUserId) => set({
    room,
    roomCode:  room.roomCode,
    players:   room.players || [],
    isHost:    room.hostId === myUserId || room.hostId?._id === myUserId,
    phase:     room.status,
    myReady:   (room.players || []).find(p => p.userId === myUserId)?.ready ?? false,
  }),

  updatePlayers: (players) => set({ players }),

  setPhase: (phase) => set({ phase }),

  setCountdown: (n) => set({ countdown: n }),

  addMessage: (msg) => set(s => ({ messages: [...s.messages.slice(-99), msg] })),

  updatePlayerScore: (userId, score) => set(s => ({
    players: s.players.map(p => p.userId === userId ? { ...p, score } : p),
  })),

  setResults: (results) => set({ results, phase: "finished" }),

  reset: () => set({
    room: null, roomCode: null, players: [], messages: [],
    myReady: false, isHost: false, phase: "idle",
    countdown: null, results: null,
  }),
}));

export default useRoomStore;
