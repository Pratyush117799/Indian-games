/**
 * NavakankariPortal.jsx
 * Supports: AI mode, Local (pass-and-play), Online (ranked + private room).
 *
 * Mode flow:
 *  MENU → pick mode → LOBBY (if online) → IN_GAME
 */
import React, { useState, useCallback, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setDifficulty, toggleSound } from '../../store/gameSlice.js'

import Board            from '../../components/navakankari/Board.jsx'
import PhaseIndicator   from '../../components/navakankari/PhaseIndicator.jsx'
import MillFlash        from '../../components/navakankari/MillFlash.jsx'
import PlayerPanel      from '../../components/shared/PlayerPanel.jsx'
import GameOverOverlay  from '../../components/shared/GameOverOverlay.jsx'
import DifficultyChips  from '../../components/shared/DifficultyChips.jsx'
import MultiplayerLobby from '../../components/shared/MultiplayerLobby.jsx'
import OnlineHUD        from '../../components/shared/OnlineHUD.jsx'

import {
  createInitialState, applyAction,
  isFlying, removableNodes, ADJ,
} from '../../game-engine/navakankari/index.js'
import { getBestMove }       from '../../game-engine/navakankari/minimax.js'
import { useNavakankariAI }  from '../../hooks/useAI.js'
import { useGameSocket, SOCKET_STATUS } from '../../hooks/useGameSocket.js'
import { sfx }               from '../../services/soundEngine.js'
import { useXP }             from '../../hooks/useXP.js'

import '../../styles/navakankari.css'

/* ── App mode states ── */
const VIEW = { MENU: 'menu', LOBBY: 'lobby', GAME: 'game' }
const MODE = { AI: 'ai', LOCAL: 'local', ONLINE: 'online' }

/* ── Status bar helper ── */
function getStatus(s, selected, mode, slot, myTurn) {
  if (s.winner === 1) return { txt: 'Victory is yours, Warrior.', cls: 'good' }
  if (s.winner === 2) return { txt: mode === MODE.AI ? 'The AI claims the board.' : 'Opponent wins.', cls: 'warn' }
  if (mode === MODE.ONLINE && !myTurn && !s.winner)
    return { txt: 'Waiting for opponent…', cls: 'think' }
  if (s.turn === 2 && mode === MODE.AI)
    return { txt: 'AI is thinking…', cls: 'think' }
  if (s.removing)
    return { txt: 'Mill formed — remove an opponent piece.', cls: 'remove' }
  const fly = isFlying(s.board, s.toPlace, s.turn)
  if (fly) return { txt: 'You may fly to any empty node.', cls: 'fly' }
  if (s.phase === 1)
    return { txt: selected === null ? 'Place a piece on any empty node.' : 'Placing…', cls: '' }
  if (selected !== null)
    return { txt: 'Move to a highlighted node.', cls: '' }
  return { txt: 'Select one of your pieces to move.', cls: '' }
}

export default function NavakankariPortal() {
  const dispatch   = useDispatch()
  const difficulty = useSelector(s => s.game.difficulty)
  const soundOn    = useSelector(s => s.game.soundEnabled)
  const playerData = useSelector(s => s.player.data)
  const { award }  = useXP()

  /* View / mode state */
  const [view,  setView]  = useState(VIEW.MENU)
  const [mode,  setMode]  = useState(MODE.AI)

  /* Game state */
  const [gs,        setGs]     = useState(createInitialState)
  const [selected,  setSel]    = useState(null)
  const [legalDests, setDests] = useState([])

  /* Online state */
  const [mySlot,     setMySlot]    = useState(1)      // 1 or 2
  const [oppTag,     setOppTag]    = useState(null)
  const [rematch,    setRematch]   = useState(false)
  const [connected,  setConnected] = useState(false)

  const snd = useCallback((n) => { if (soundOn) sfx[n]?.() }, [soundOn])

  /* ── Socket hook ── */
  const socket = useGameSocket({
    gameType: 'navakankari',

    onGameStart: ({ initialState, slot: s, opponentTag, isRematch }) => {
      setMySlot(s ?? 1)
      setOppTag(opponentTag)
      setConnected(true)
      setGs(initialState ?? createInitialState())
      setSel(null); setDests([])
      setRematch(false)
      setView(VIEW.GAME)
    },

    onOpponentMove: (move) => {
      snd(move.type === 'remove' ? 'remove' : 'move')
      setGs(prev => {
        const ns = applyAction(prev, move)
        if (ns.winner) {
          socket.reportGameOver(ns.winner)
          if (ns.winner === mySlot) snd('win')
          else snd('lose')
        }
        return ns
      })
    },

    onGameOver: ({ winner }) => {
      setGs(prev => ({ ...prev, winner }))
    },

    onResign: ({ slot: s }) => {
      const winner = s === 1 ? 2 : 1
      setGs(prev => ({ ...prev, winner }))
    },

    onRematchOffer: () => setRematch(true),
    onOpponentLeft: () => setConnected(false),
    onError: (msg)  => console.error('Socket error:', msg),
  })

  /* ── AI turn ── */
  useNavakankariAI({
    state:    gs,
    difficulty,
    enabled:  mode === MODE.AI,
    onMove:   (move) => {
      if (!move) return
      snd(move.type === 'remove' ? 'remove' : 'place')
      setGs(prev => {
        const ns = applyAction(prev, move)
        if (ns.removing && ns.turn === 2) {
          // Chain AI remove
          setTimeout(() => {
            const rmv = getBestMove(ns, difficulty)
            if (rmv) { snd('remove'); setGs(applyAction(ns, rmv)) }
          }, 600)
        }
        if (ns.winner === 2) snd('lose')
        return ns
      })
    },
  })

  /* ── Human click ── */
  const myTurn = mode === MODE.ONLINE
    ? gs.turn === mySlot
    : mode === MODE.LOCAL
      ? true
      : gs.turn === 1

  const handleNodeClick = useCallback((i) => {
    if (gs.winner !== null) return
    if (!myTurn) return
    const actualTurn = mode === MODE.ONLINE ? mySlot : 1
    // In local mode both players control their respective turn
    if (mode !== MODE.LOCAL && gs.turn !== actualTurn && mode !== MODE.ONLINE) return

    const b = gs.board
    const p = mode === MODE.LOCAL ? gs.turn : actualTurn

    // Remove
    if (gs.removing && gs.turn === p) {
      const opp = 3 - p
      if (!removableNodes(b, opp).includes(i)) return
      snd('remove')
      const move = { type: 'remove', node: i }
      if (mode === MODE.ONLINE) socket.sendMove(move)
      setGs(prev => {
        const ns = applyAction(prev, move)
        if (ns.winner) {
          if (mode === MODE.ONLINE) socket.reportGameOver(ns.winner)
          if (ns.winner === (mode === MODE.ONLINE ? mySlot : 1)) {
            snd('win'); award('win_' + (mode === MODE.AI ? difficulty : 'ranked'))
          }
        }
        return ns
      })
      setSel(null); setDests([]); return
    }

    // Placement
    if (gs.phase === 1 && gs.toPlace[p] > 0 && gs.turn === p) {
      if (b[i] !== 0) return
      snd('place')
      const move = { type: 'place', to: i }
      if (mode === MODE.ONLINE) socket.sendMove(move)
      setGs(prev => {
        const ns = applyAction(prev, move)
        if (ns.winner) {
          if (mode === MODE.ONLINE) socket.reportGameOver(ns.winner)
          if (ns.winner === (mode === MODE.ONLINE ? mySlot : p)) {
            snd('win'); award('win_' + (mode === MODE.AI ? difficulty : 'ranked'))
          }
        }
        return ns
      })
      setSel(null); setDests([]); return
    }

    // Movement
    if (gs.turn !== p) return
    if (selected === null) {
      if (b[i] !== p) return
      const canFly = isFlying(b, gs.toPlace, p)
      const dests  = canFly
        ? Array.from({ length: 24 }, (_, k) => k).filter(j => b[j] === 0)
        : ADJ[i].filter(j => b[j] === 0)
      setSel(i); setDests(dests)
    } else {
      if (i === selected)   { setSel(null); setDests([]); return }
      if (b[i] === p) {
        const canFly = isFlying(b, gs.toPlace, p)
        const dests  = canFly
          ? Array.from({ length: 24 }, (_, k) => k).filter(j => b[j] === 0)
          : ADJ[i].filter(j => b[j] === 0)
        setSel(i); setDests(dests); return
      }
      if (!legalDests.includes(i)) { setSel(null); setDests([]); return }
      snd('move')
      const move = { type: 'move', from: selected, to: i }
      if (mode === MODE.ONLINE) socket.sendMove(move)
      setGs(prev => {
        const ns = applyAction(prev, move)
        if (ns.winner) {
          if (mode === MODE.ONLINE) socket.reportGameOver(ns.winner)
          if (ns.winner === (mode === MODE.ONLINE ? mySlot : p)) {
            snd('win'); award('win_' + (mode === MODE.AI ? difficulty : 'ranked'))
          }
        }
        return ns
      })
      setSel(null); setDests([])
    }
  }, [gs, selected, legalDests, mode, mySlot, myTurn, difficulty, snd, award, socket])

  const handleReset = () => {
    setGs(createInitialState()); setSel(null); setDests([])
  }

  const handleHint = () => {
    if (!myTurn || gs.winner) return
    const move = getBestMove({ ...gs, turn: mode === MODE.ONLINE ? mySlot : 1 }, 'medium')
    if (!move) return
    if (move.from !== undefined) setSel(move.from)
    setDests([move.to ?? move.node])
    setTimeout(() => { setSel(null); setDests([]) }, 2500)
  }

  /* ── Menu ── */
  if (view === VIEW.MENU) {
    return (
      <div className="nava-portal fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="nava-header" style={{ width: '100%' }}>
          <div>
            <Link to="/" style={{ fontSize: '.56rem', color: 'var(--txt-muted)', letterSpacing: '.1em', textDecoration: 'none', display: 'block', marginBottom: '.3rem' }}>← KRIDA HUB</Link>
            <div className="nava-title">NAVAKANKARI</div>
            <div className="nava-subtitle">नव कंकड़ी · Nine Men's Morris · Ancient India</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', width: '100%', maxWidth: 340, paddingTop: '1rem' }}>
          <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.18em', color: 'var(--txt-muted)', textAlign: 'center', marginBottom: '.3rem' }}>SELECT MODE</div>
          {[
            { m: MODE.AI,    label: '🤖  VS COMPUTER',      sub: 'Play against the minimax AI' },
            { m: MODE.LOCAL, label: '👥  LOCAL 2-PLAYER',   sub: 'Pass and play on same screen' },
            { m: MODE.ONLINE,label: '🌐  PLAY ONLINE',      sub: 'Ranked match or private room' },
          ].map(({ m, label, sub }) => (
            <button key={m} className="nava-btn" style={{ padding: '.7rem 1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '.15rem' }}
              onClick={() => {
                setMode(m)
                if (m === MODE.ONLINE) setView(VIEW.LOBBY)
                else { handleReset(); setView(VIEW.GAME) }
              }}>
              <span style={{ color: 'var(--txt-primary)', fontSize: '.68rem' }}>{label}</span>
              <span style={{ color: 'var(--txt-muted)', fontSize: '.56rem', letterSpacing: '.05em', fontWeight: 400 }}>{sub}</span>
            </button>
          ))}
          {mode === MODE.AI && (
            <div style={{ marginTop: '.3rem' }}>
              <div style={{ fontSize: '.56rem', color: 'var(--txt-muted)', letterSpacing: '.1em', textAlign: 'center', marginBottom: '.4rem' }}>AI DIFFICULTY</div>
              <DifficultyChips value={difficulty} onChange={d => dispatch(setDifficulty(d))}/>
            </div>
          )}
        </div>
      </div>
    )
  }

  /* ── Lobby ── */
  if (view === VIEW.LOBBY) {
    return (
      <div className="nava-portal fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="nava-header" style={{ width: '100%' }}>
          <div>
            <div className="nava-title">NAVAKANKARI</div>
            <div className="nava-subtitle">Online Multiplayer</div>
          </div>
        </div>
        <MultiplayerLobby
          gameType="navakankari"
          status={socket.status}
          roomId={socket.roomId}
          queuePos={socket.queuePos}
          opponentTag={socket.opponentTag}
          onRanked={socket.joinMatchmaking}
          onCancelQueue={socket.leaveMatchmaking}
          onCreateRoom={socket.createPrivateRoom}
          onJoinRoom={socket.joinPrivateRoom}
          onBack={() => setView(VIEW.MENU)}
        />
      </div>
    )
  }

  /* ── Game ── */
  const { txt, cls } = getStatus(gs, selected, mode, mySlot, myTurn)

  return (
    <div className="nava-portal fade-in">
      <div className="nava-header">
        <div>
          <button className="nava-btn" style={{ marginBottom: '.3rem', fontSize: '.54rem' }}
            onClick={() => setView(VIEW.MENU)}>← MENU</button>
          <div className="nava-title">NAVAKANKARI</div>
          <div className="nava-subtitle">
            {mode === MODE.AI    ? `VS AI · ${difficulty.toUpperCase()}` :
             mode === MODE.LOCAL ? 'LOCAL 2-PLAYER' :
             `ONLINE · ${socket.roomId ?? '…'}`}
          </div>
        </div>
        <PhaseIndicator state={gs}/>
      </div>

      <div className="nava-arena">
        <PlayerPanel player={mode === MODE.ONLINE ? mySlot : 1} state={gs}
          active={(mode === MODE.ONLINE ? mySlot : 1) === gs.turn && !gs.winner}/>

        <div className="nava-board-section">
          {/* Online HUD */}
          {mode === MODE.ONLINE && (
            <OnlineHUD
              myTag={playerData?.tagId}
              opponentTag={oppTag}
              connected={connected}
              rematchOffer={rematch}
              onResign={socket.sendResign}
              onRematch={socket.sendRematch}
            />
          )}

          <div className={`nava-status ${cls}`}>{txt}</div>

          <div style={{ position: 'relative', width: '100%', maxWidth: 380 }}>
            <Board state={gs} selected={selected} legalDests={legalDests}
              onNodeClick={handleNodeClick}/>
            <MillFlash millNodes={gs.lastMills}/>
          </div>

          <div className="nava-sep"/>

          {mode === MODE.AI && (
            <DifficultyChips value={difficulty} onChange={d => dispatch(setDifficulty(d))}/>
          )}

          <div className="nava-ctrls">
            {mode !== MODE.ONLINE && (
              <button className="nava-btn"
                disabled={!myTurn || !!gs.winner}
                onClick={handleHint}>HINT</button>
            )}
            {mode !== MODE.ONLINE && (
              <button className="nava-btn" onClick={handleReset}>NEW GAME</button>
            )}
            {mode === MODE.ONLINE && gs.winner && (
              <button className="nava-btn" onClick={socket.sendRematch}>REQUEST REMATCH</button>
            )}
            <button className={`nava-btn ${soundOn ? 'active' : ''}`}
              onClick={() => dispatch(toggleSound())}>
              {soundOn ? 'SFX ON' : 'SFX OFF'}
            </button>
          </div>

          <div className="nava-legend">
            <b>Outer · Middle · Inner</b> squares &nbsp;·&nbsp;
            Line of 3 = mill &nbsp;·&nbsp; Remove opponent piece
          </div>
        </div>

        <PlayerPanel player={mode === MODE.ONLINE ? 3 - mySlot : 2} state={gs}
          active={(mode === MODE.ONLINE ? 3 - mySlot : 2) === gs.turn && !gs.winner}/>
      </div>

      {gs.winner && <GameOverOverlay winner={gs.winner} onReplay={handleReset}/>}
    </div>
  )
}
