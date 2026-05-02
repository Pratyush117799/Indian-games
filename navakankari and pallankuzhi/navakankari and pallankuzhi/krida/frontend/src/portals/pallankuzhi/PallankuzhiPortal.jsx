/**
 * PallankuzhiPortal.jsx
 * Supports: AI mode, Local (pass-and-play), Online (ranked + private room).
 */
import React, { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { setDifficulty, toggleSound } from '../../store/gameSlice.js'

import PallankuzhiBoard from '../../components/pallankuzhi/Board.jsx'
import SeedAnimation    from '../../components/pallankuzhi/SeedAnimation.jsx'
import GameOverOverlay  from '../../components/shared/GameOverOverlay.jsx'
import DifficultyChips  from '../../components/shared/DifficultyChips.jsx'
import MultiplayerLobby from '../../components/shared/MultiplayerLobby.jsx'
import OnlineHUD        from '../../components/shared/OnlineHUD.jsx'

import {
  createInitialState, applyAction, getLegalMoves,
} from '../../game-engine/pallankuzhi/index.js'
import { getAIMove }         from '../../game-engine/pallankuzhi/aiCounter.js'
import { usePallankuzhiAI }  from '../../hooks/useAI.js'
import { useGameSocket }     from '../../hooks/useGameSocket.js'
import { sfx }               from '../../services/soundEngine.js'
import { useXP }             from '../../hooks/useXP.js'

import '../../styles/pallankuzhi.css'

const VIEW = { MENU: 'menu', LOBBY: 'lobby', GAME: 'game' }
const MODE = { AI: 'ai', LOCAL: 'local', ONLINE: 'online' }
const TOTAL_SEEDS = 168

export default function PallankuzhiPortal() {
  const dispatch   = useDispatch()
  const difficulty = useSelector(s => s.game.difficulty)
  const soundOn    = useSelector(s => s.game.soundEnabled)
  const playerData = useSelector(s => s.player.data)
  const { award }  = useXP()

  const [view,     setView]    = useState(VIEW.MENU)
  const [mode,     setMode]    = useState(MODE.AI)
  const [gs,       setGs]      = useState(createInitialState)
  const [animating, setAnim]   = useState(false)
  const [lastAnim, setLastAnim] = useState(null)
  const [mySlot,   setMySlot]  = useState(1)
  const [oppTag,   setOppTag]  = useState(null)
  const [rematch,  setRematch] = useState(false)
  const [connected,setConnected] = useState(false)

  const snd = useCallback((n) => { if (soundOn) sfx[n]?.() }, [soundOn])

  const doMove = useCallback((cupIdx, state, fromOnline = false) => {
    const { newState, animation } = applyAction(state, cupIdx)
    snd('seed')
    if (animation?.captures?.length) snd('capture')
    setLastAnim(animation)
    setAnim(true)
    setGs(newState)
    if (newState.winner === 1) { snd('win');  award('win_' + (mode === MODE.AI ? difficulty : 'ranked')) }
    if (newState.winner === 2)   snd('lose')
    return newState
  }, [snd, difficulty, mode, award])

  /* ── Socket ── */
  const socket = useGameSocket({
    gameType: 'pallankuzhi',

    onGameStart: ({ initialState, slot: s, opponentTag, isRematch }) => {
      setMySlot(s ?? 1)
      setOppTag(opponentTag)
      setConnected(true)
      setGs(initialState ?? createInitialState())
      setAnim(false); setLastAnim(null); setRematch(false)
      setView(VIEW.GAME)
    },

    onOpponentMove: ({ cupIndex }) => {
      setGs(prev => {
        const { newState, animation } = applyAction(prev, cupIndex)
        snd('seed')
        if (animation?.captures?.length) snd('capture')
        setLastAnim(animation)
        setAnim(true)
        if (newState.winner) {
          socket.reportGameOver(newState.winner)
          if (newState.winner === mySlot) snd('win')
          else snd('lose')
        }
        return newState
      })
    },

    onGameOver:    ({ winner }) => setGs(prev => ({ ...prev, winner })),
    onResign:      ({ slot: s }) => setGs(prev => ({ ...prev, winner: s === 1 ? 2 : 1 })),
    onRematchOffer: () => setRematch(true),
    onOpponentLeft: () => setConnected(false),
    onError:        (msg) => console.error('Socket error:', msg),
  })

  /* ── AI turn ── */
  usePallankuzhiAI({
    state:   gs,
    difficulty,
    enabled: mode === MODE.AI && !animating,
    onMove:  (cup) => doMove(cup, gs),
  })

  /* ── Human click ── */
  const myTurn = mode === MODE.ONLINE ? gs.turn === mySlot : true

  const handleCupClick = useCallback((cupIdx) => {
    if (gs.winner !== null || animating) return
    if (mode === MODE.ONLINE && !myTurn) return
    const p = mode === MODE.LOCAL ? gs.turn : (mode === MODE.ONLINE ? mySlot : 1)
    if (gs.turn !== p) return
    if (!getLegalMoves(gs).includes(cupIdx)) return

    const move = { cupIndex: cupIdx }
    if (mode === MODE.ONLINE) socket.sendMove(move)
    doMove(cupIdx, gs)
  }, [gs, animating, mode, mySlot, myTurn, doMove, socket])

  const handleReset = () => {
    setGs(createInitialState()); setAnim(false); setLastAnim(null)
  }

  const pctYou = (gs.score[1] / TOTAL_SEEDS) * 100
  const pctAI  = (gs.score[2] / TOTAL_SEEDS) * 100
  const legalMoves = (myTurn && !gs.winner) ? getLegalMoves(gs) : []

  /* ── Menu ── */
  if (view === VIEW.MENU) {
    return (
      <div className="palla-portal fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="palla-header" style={{ width: '100%' }}>
          <div>
            <Link to="/" style={{ fontSize: '.56rem', color: 'var(--txt-muted)', letterSpacing: '.1em', textDecoration: 'none', display: 'block', marginBottom: '.3rem' }}>← KRIDA HUB</Link>
            <div className="palla-title">PALLANKUZHI</div>
            <div className="palla-subtitle">பல்லாங்குழி · Tamil Nadu Mancala</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', width: '100%', maxWidth: 340, paddingTop: '1rem' }}>
          <div style={{ fontSize: '.6rem', fontWeight: 700, letterSpacing: '.18em', color: 'var(--txt-muted)', textAlign: 'center', marginBottom: '.3rem' }}>SELECT MODE</div>
          {[
            { m: MODE.AI,     label: '🤖  VS COMPUTER',    sub: 'Play against counting AI' },
            { m: MODE.LOCAL,  label: '👥  PASS & PLAY',    sub: 'Two players, one screen' },
            { m: MODE.ONLINE, label: '🌐  PLAY ONLINE',    sub: 'Ranked match or private room' },
          ].map(({ m, label, sub }) => (
            <button key={m} className="palla-btn" style={{ padding: '.7rem 1rem', textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '.15rem' }}
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
      <div className="palla-portal fade-in" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="palla-header" style={{ width: '100%' }}>
          <div>
            <div className="palla-title">PALLANKUZHI</div>
            <div className="palla-subtitle">Online Multiplayer</div>
          </div>
        </div>
        <MultiplayerLobby
          gameType="pallankuzhi"
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
  return (
    <div className="palla-portal fade-in">
      <div className="palla-header">
        <div>
          <button className="palla-btn" style={{ marginBottom: '.3rem', fontSize: '.54rem' }}
            onClick={() => setView(VIEW.MENU)}>← MENU</button>
          <div className="palla-title">PALLANKUZHI</div>
          <div className="palla-subtitle">
            {mode === MODE.AI    ? `VS AI · ${difficulty.toUpperCase()}` :
             mode === MODE.LOCAL ? 'PASS & PLAY' :
             `ONLINE · ${socket.roomId ?? '…'}`}
          </div>
        </div>
      </div>

      <div className="palla-arena">
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

        <div className="palla-scorebar">
          <span className="palla-score-label ai">
            {mode === MODE.ONLINE ? `#${oppTag ?? 'OPP'}` : 'AI'}
          </span>
          <div className="palla-score-track">
            <div className="palla-score-fill ai" style={{ width: `${pctAI}%` }}/>
          </div>
          <span className="palla-score-count ai">{gs.score[2]}</span>
        </div>

        <div className="palla-board-wrap" style={{ position: 'relative' }}>
          <PallankuzhiBoard state={gs} onCupClick={handleCupClick}
            legalMoves={legalMoves} animating={animating}/>
          <SeedAnimation animation={lastAnim} onDone={() => setAnim(false)}/>
        </div>

        <div className="palla-scorebar">
          <span className="palla-score-label you">
            {mode === MODE.ONLINE ? `#${playerData?.tagId ?? 'YOU'}` : 'YOU'}
          </span>
          <div className="palla-score-track">
            <div className="palla-score-fill you" style={{ width: `${pctYou}%` }}/>
          </div>
          <span className="palla-score-count you">{gs.score[1]}</span>
        </div>

        <div className={`palla-status ${gs.turn === 2 && mode === MODE.AI ? 'think' : 'good'}`}>
          {gs.winner
            ? (gs.winner === (mode === MODE.ONLINE ? mySlot : 1) ? 'You win! Well sown!' : 'Opponent wins.')
            : !myTurn ? 'Waiting for opponent…'
            : gs.turn === 2 && mode === MODE.AI ? 'AI is counting seeds…'
            : 'Pick a cup on your row to sow.'}
        </div>

        {mode === MODE.AI && <DifficultyChips value={difficulty} onChange={d => dispatch(setDifficulty(d))}/>}

        <div className="palla-ctrls">
          {mode !== MODE.ONLINE && <button className="palla-btn" onClick={handleReset}>NEW GAME</button>}
          {mode === MODE.ONLINE && gs.winner && (
            <button className="palla-btn" onClick={socket.sendRematch}>REQUEST REMATCH</button>
          )}
          <button className={`palla-btn ${soundOn ? 'active' : ''}`}
            onClick={() => dispatch(toggleSound())}>
            {soundOn ? 'SFX ON' : 'SFX OFF'}
          </button>
        </div>
      </div>

      {gs.winner && gs.winner !== -1 && (
        <GameOverOverlay winner={gs.winner === mySlot ? 1 : 2} onReplay={handleReset}/>
      )}
    </div>
  )
}
