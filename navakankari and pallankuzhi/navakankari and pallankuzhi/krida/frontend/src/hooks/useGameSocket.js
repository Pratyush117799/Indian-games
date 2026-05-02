/**
 * useGameSocket.js
 * Full multiplayer socket hook.
 * Manages: matchmaking, private rooms, move relay,
 *          resign, rematch, opponent-left, reconnect.
 */
import { useEffect, useCallback, useRef, useState } from 'react'
import { getSocket, connectSocket } from '../services/socket.js'

export const SOCKET_STATUS = {
  IDLE:       'idle',
  CONNECTING: 'connecting',
  QUEUED:     'queued',
  MATCHED:    'matched',
  IN_GAME:    'in_game',
  OPPONENT_LEFT: 'opponent_left',
  ERROR:      'error',
}

/**
 * @param {object} opts
 * @param {string}   opts.gameType        - 'navakankari' | 'pallankuzhi'
 * @param {function} opts.onGameStart     - ({ initialState, slot, opponentTag, isRematch })
 * @param {function} opts.onOpponentMove  - (move)
 * @param {function} opts.onGameOver      - ({ winner })
 * @param {function} opts.onResign        - ({ slot })
 * @param {function} opts.onRematchOffer  - ({ slot })
 * @param {function} opts.onOpponentLeft  - ()
 * @param {function} opts.onError         - (msg)
 */
export const useGameSocket = ({
  gameType,
  onGameStart,
  onOpponentMove,
  onGameOver,
  onResign,
  onRematchOffer,
  onOpponentLeft,
  onError,
}) => {
  const [status,     setStatus]     = useState(SOCKET_STATUS.IDLE)
  const [roomId,     setRoomId]     = useState(null)
  const [slot,       setSlot]       = useState(null)       // 1 or 2
  const [opponentTag, setOpponent]  = useState(null)
  const [queuePos,   setQueuePos]   = useState(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true
    return () => { mounted.current = false }
  }, [])

  // ── Attach socket listeners once ─────────────────────────────────────────
  useEffect(() => {
    const socket = getSocket()
    connectSocket()
    setStatus(SOCKET_STATUS.CONNECTING)

    const safe = (fn) => (...args) => { if (mounted.current) fn(...args) }

    socket.on('connect', safe(() => {
      setStatus(SOCKET_STATUS.IDLE)
    }))

    socket.on('connect_error', safe((err) => {
      setStatus(SOCKET_STATUS.ERROR)
      onError?.(`Connection failed: ${err.message}`)
    }))

    // Matchmaking
    socket.on('mm:queued', safe(({ position }) => {
      setStatus(SOCKET_STATUS.QUEUED)
      setQueuePos(position)
    }))

    socket.on('mm:matched', safe(({ roomId: rid, slot: s, opponentTag: opp }) => {
      setRoomId(rid)
      setSlot(s)
      setOpponent(opp)
      setStatus(SOCKET_STATUS.MATCHED)
    }))

    // Private room
    socket.on('room:created', safe(({ roomId: rid }) => {
      setRoomId(rid)
      setSlot(1)
      setStatus(SOCKET_STATUS.QUEUED)
    }))

    socket.on('room:joined', safe(({ roomId: rid, slot: s, opponentTag: opp }) => {
      setRoomId(rid)
      setSlot(s)
      setOpponent(opp)
      setStatus(SOCKET_STATUS.MATCHED)
    }))

    socket.on('room:error', safe(({ msg }) => {
      setStatus(SOCKET_STATUS.ERROR)
      onError?.(msg)
    }))

    // Game lifecycle
    socket.on('game:start', safe(({ initialState, isRematch }) => {
      setStatus(SOCKET_STATUS.IN_GAME)
      onGameStart?.({ initialState, slot, opponentTag, isRematch: !!isRematch })
    }))

    socket.on('game:move', safe(({ move }) => {
      onOpponentMove?.(move)
    }))

    socket.on('game:invalid', safe(({ reason }) => {
      console.warn('Server rejected move:', reason)
      onError?.(`Invalid move: ${reason}`)
    }))

    socket.on('game:over', safe(({ winner }) => {
      onGameOver?.({ winner })
    }))

    socket.on('game:resign', safe(({ slot: resignSlot }) => {
      onResign?.({ slot: resignSlot })
    }))

    socket.on('game:rematch', safe(({ slot: s }) => {
      onRematchOffer?.({ slot: s })
    }))

    socket.on('opponent:left', safe(() => {
      setStatus(SOCKET_STATUS.OPPONENT_LEFT)
      onOpponentLeft?.()
    }))

    return () => {
      socket.off('connect')
      socket.off('connect_error')
      socket.off('mm:queued')
      socket.off('mm:matched')
      socket.off('room:created')
      socket.off('room:joined')
      socket.off('room:error')
      socket.off('game:start')
      socket.off('game:move')
      socket.off('game:invalid')
      socket.off('game:over')
      socket.off('game:resign')
      socket.off('game:rematch')
      socket.off('opponent:left')
    }
  }, [gameType])

  // ── Actions ───────────────────────────────────────────────────────────────
  const joinMatchmaking = useCallback(() => {
    setStatus(SOCKET_STATUS.QUEUED)
    getSocket().emit('mm:join', { gameType })
  }, [gameType])

  const leaveMatchmaking = useCallback(() => {
    setStatus(SOCKET_STATUS.IDLE)
    getSocket().emit('mm:leave', { gameType })
  }, [gameType])

  const createPrivateRoom = useCallback(() => {
    getSocket().emit('room:create', { gameType })
  }, [gameType])

  const joinPrivateRoom = useCallback((rid) => {
    getSocket().emit('room:join', { roomId: rid })
  }, [])

  const sendMove = useCallback((move) => {
    getSocket().emit('game:move', { move })
  }, [])

  const sendResign = useCallback(() => {
    getSocket().emit('game:resign')
    setStatus(SOCKET_STATUS.IDLE)
  }, [])

  const sendRematch = useCallback(() => {
    getSocket().emit('game:rematch')
  }, [])

  const reportGameOver = useCallback((winner) => {
    getSocket().emit('game:over', { winner })
  }, [])

  return {
    status, roomId, slot, opponentTag, queuePos,
    joinMatchmaking, leaveMatchmaking,
    createPrivateRoom, joinPrivateRoom,
    sendMove, sendResign, sendRematch, reportGameOver,
  }
}
