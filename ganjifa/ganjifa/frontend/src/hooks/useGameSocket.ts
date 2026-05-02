'use client';
import { useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { connectSocket, getSocket } from '@/lib/socket';
import { useGameStore } from '@/store/gameStore';
import api from '@/lib/api';

/**
 * useGameSocket — wraps all Socket.IO event handling for a Ganjifa game room.
 * Call once at the top of the game page; returns action callbacks.
 */
export function useGameSocket(roomCode: string, userId: string, accessToken: string | null) {
  const router = useRouter();
  const {
    setRoom, setPlayers, setGameState, setLastTrick,
    setRoundWinner, setGameOver, setHukmEvent, setDealing,
    addChat, reset,
  } = useGameStore();

  const hukmFlashTimeout = useRef<NodeJS.Timeout | null>(null);

  // ── Connect + wire events ─────────────────────────────────
  useEffect(() => {
    if (!roomCode || !userId || !accessToken) return;
    const socket = connectSocket(accessToken);

    // Fetch initial room state
    api.get(`/rooms/${roomCode}`)
      .then(({ data }) => { setRoom(data.room, data.players); })
      .catch(() => toast.error('Room not found'));

    socket.emit('room:join', { roomCode });

    // ── Room events ───────────────────────────────────────
    socket.on('room:state',         ({ room, players }) => { setRoom(room, players); setPlayers(players); });
    socket.on('room:player_joined', ({ username })       => toast(`${username} joined ✦`));
    socket.on('room:abandoned',     ({ message })        => {
      toast.error(message);
      reset();
      router.push('/lobby');
    });
    socket.on('room:message',       msg => addChat(msg));

    // ── Game events ───────────────────────────────────────
    socket.on('room:start', state => {
      setDealing(true);
      setGameState(state);
      toast('Game started — cards dealt! 🎴', { icon:'✦', duration:3000 });
    });

    socket.on('game:state', state => setGameState(state));

    socket.on('game:hukm_declared', ({ suit, declaredBy }) => {
      setHukmEvent({ suit, declaredBy });
      // Auto-clear flash after 2.5s
      if (hukmFlashTimeout.current) clearTimeout(hukmFlashTimeout.current);
      hukmFlashTimeout.current = setTimeout(() => setHukmEvent(null), 2500);
    });

    socket.on('game:trick_end', ({ trickWinner, trick, tricksWon }) => {
      setLastTrick({ trickWinner, trick, tricksWon });
      // Clear after sweep animation completes
      setTimeout(() => setLastTrick(null), 1400);
    });

    socket.on('game:round_end', ({ roundWinner, scores, sessionScores }) => {
      setRoundWinner(roundWinner);
    });

    socket.on('game:round_started', () => setRoundWinner(null));

    socket.on('game:over', ({ winner, winnerId, finalScores }) => {
      setGameOver({ winner: winnerId || winner, finalScores });
    });

    socket.on('game:error', ({ message }) => toast.error(message));

    return () => {
      const events = [
        'room:state','room:player_joined','room:abandoned','room:message',
        'room:start','game:state','game:hukm_declared','game:trick_end',
        'game:round_end','game:round_started','game:over','game:error',
      ];
      events.forEach(e => socket.off(e));
      socket.emit('room:leave', { roomCode });
      if (hukmFlashTimeout.current) clearTimeout(hukmFlashTimeout.current);
      reset();
    };
  }, [roomCode, userId, accessToken]);

  // ── Action callbacks ──────────────────────────────────────
  const markReady = useCallback(() => {
    getSocket().emit('room:ready', { roomCode });
  }, [roomCode]);

  const playCard = useCallback((cardId: string) => {
    getSocket().emit('game:play', { roomCode, cardId });
  }, [roomCode]);

  const declareHukm = useCallback((suit: string) => {
    getSocket().emit('game:hukm', { roomCode, suit });
  }, [roomCode]);

  const skipHukm = useCallback(() => {
    getSocket().emit('game:skip_hukm', { roomCode });
  }, [roomCode]);

  const nextRound = useCallback(() => {
    getSocket().emit('game:next_round', { roomCode });
  }, [roomCode]);

  const sendChat = useCallback((message: string) => {
    if (!message.trim()) return;
    getSocket().emit('room:chat', { roomCode, message });
  }, [roomCode]);

  return { markReady, playCard, declareHukm, skipHukm, nextRound, sendChat };
}
