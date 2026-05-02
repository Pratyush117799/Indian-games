'use client';
import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { MessageCircle, X, Copy } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useGameStore } from '@/store/gameStore';
import { useGameSocket } from '@/hooks/useGameSocket';
import { DASHAVATARA_SUITS, RAMAYANA_SUITS, GEOPOLITICS_SUITS } from '@/lib/suitData';
import GameTable from '@/components/table/GameTable';
import {
  HukmDeclaration, HukmFlash, ScoreStrip,
  RoundEndBanner, GameOverModal,
} from '@/components/game/GameModals';
import type { SuitDef } from '@/types';

const SUITS_MAP: Record<string, SuitDef[]> = {
  dashavatara: DASHAVATARA_SUITS,
  ramayana:    RAMAYANA_SUITS,
  geopolitics: GEOPOLITICS_SUITS,
};

export default function GamePage() {
  const { roomCode } = useParams<{ roomCode: string }>();
  const router = useRouter();
  const { user, accessToken } = useAuthStore();
  const {
    room, players, gameState, roundWinner,
    gameOver, hukmEvent, chatMessages, dealingAnimation, reset,
  } = useGameStore();
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { markReady, playCard, declareHukm, skipHukm, nextRound, sendChat }
    = useGameSocket(roomCode, user?.id || '', accessToken);

  const myId      = user?.id || '';
  const isHost    = room?.host_id === myId;
  const themeSlug = gameState?.themeSlug || (room as any)?.theme_slug || 'dashavatara';
  const suits     = SUITS_MAP[themeSlug] || DASHAVATARA_SUITS;
  const usernames = Object.fromEntries(players.map(p => [p.id, p.username]));

  function handleSendChat(e: React.FormEvent) {
    e.preventDefault();
    sendChat(chatInput);
    setChatInput('');
  }

  if (!gameState) {
    const myPlayer = players.find(p => p.id === myId);
    const allReady = players.length >= (room?.max_players || 2) && players.every(p => p.is_ready);
    return (
      <div className="max-w-lg mx-auto px-4 py-10 space-y-4">
        <div className="mughal-border bg-black/40 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-mughal text-xl text-gold">Waiting Room</h2>
              <p className="text-xs text-ivory/30 mt-0.5">
                {room?.theme_name} · {room?.num_rounds} rounds
                {room?.is_vs_ai && ` · AI (${room?.ai_difficulty})`}
              </p>
            </div>
            <button onClick={() => navigator.clipboard.writeText(roomCode)}
              className="flex items-center gap-2 bg-gold/10 border border-gold/30 px-3 py-1.5 rounded-lg hover:bg-gold/20 transition">
              <span className="font-mono font-bold text-gold tracking-widest text-lg">{roomCode}</span>
              <Copy size={13} className="text-gold/40"/>
            </button>
          </div>
          <div className="space-y-2">
            {Array.from({ length: room?.max_players || 3 }).map((_, si) => {
              const p = players.find(pl => pl.seat_index === si);
              return (
                <div key={si} className={clsx('flex items-center justify-between px-3 py-2 rounded-lg border text-sm',
                  p ? 'bg-gold/5 border-gold/20' : 'bg-black/20 border-dashed border-white/10')}>
                  <span className={clsx(p ? 'text-ivory font-medium' : 'text-ivory/25 italic')}>
                    {p ? p.username : 'Waiting for player…'}
                    {p?.id === room?.host_id && <span className="text-gold ml-2 text-xs font-mughal">♔ Host</span>}
                  </span>
                  {p && <span className={clsx('badge border text-xs',
                    p.is_ready ? 'bg-green-900/30 text-green-400 border-green-700/30' : 'bg-white/5 text-ivory/30 border-white/10')}>
                    {p.is_ready ? '✓ Ready' : 'Waiting'}
                  </span>}
                </div>
              );
            })}
          </div>
          {myPlayer && !myPlayer.is_ready && (
            <button onClick={markReady} className="btn-gold w-full py-3 font-mughal tracking-widest">I'M READY →</button>
          )}
          {allReady && (
            <motion.p initial={{opacity:0}} animate={{opacity:1}}
              className="text-center text-sm text-gold font-mughal animate-pulse tracking-wider">
              ✦ All players ready — starting… ✦
            </motion.p>
          )}
        </div>
        <div className="panel text-xs text-ivory/30 grid grid-cols-2 gap-1">
          <p>Theme: <span className="text-gold/60">{room?.theme_name}</span></p>
          <p>Rounds: <span className="text-gold/60">{room?.num_rounds}</span></p>
          <p>Players: <span className="text-gold/60">{room?.max_players}</span></p>
          <p>Hukm: <span className="text-gold/60">{room?.hukm_allowed ? 'Enabled' : 'Disabled'}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pb-4">
      <AnimatePresence>
        {gameState.phase === 'hukm' && (
          <HukmDeclaration suits={suits} isLeader={gameState.currentLeader === myId}
            onDeclare={declareHukm} onSkip={skipHukm}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hukmEvent && <HukmFlash suit={hukmEvent.suit} declaredBy={hukmEvent.declaredBy}/>}
      </AnimatePresence>
      <AnimatePresence>
        {roundWinner !== undefined && roundWinner !== null && gameState.phase === 'round_end' && !gameOver && (
          <RoundEndBanner roundWinner={roundWinner} usernames={usernames} myId={myId}
            currentRound={gameState.currentRound} numRounds={gameState.numRounds}
            onNextRound={nextRound} isHost={isHost}/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {gameOver && (
          <GameOverModal gameWinner={gameOver.winner} usernames={usernames} myId={myId}
            finalScores={gameOver.finalScores}
            onPlayAgain={() => { reset(); router.push('/lobby'); }}/>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto px-3 py-3 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gold/40 font-mughal tracking-wider">
              ROUND {gameState.currentRound}/{gameState.numRounds}
            </span>
            {gameState.hukm && (
              <motion.span initial={{scale:0}} animate={{scale:1}} className="badge-suit">
                ✦ HUKM: {gameState.hukm.toUpperCase()}
              </motion.span>
            )}
          </div>
          <button onClick={() => setChatOpen(o => !o)}
            className="relative p-2 rounded-lg hover:bg-gold/10 text-gold/40 hover:text-gold transition">
            <MessageCircle size={16}/>
            {chatMessages.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-crimson"/>}
          </button>
        </div>
        <ScoreStrip playerIds={gameState.playerIds} usernames={usernames}
          tricksWon={gameState.tricksWon} sessionScores={gameState.sessionScores}
          myId={myId} currentLeader={gameState.currentLeader} nextToPlay={gameState.nextToPlay || null}/>
        <GameTable state={gameState} myId={myId} usernames={usernames}
          theme={themeSlug} onPlay={playCard} isDealing={dealingAnimation}/>
      </div>

      <AnimatePresence>
        {chatOpen && (
          <motion.div initial={{x:320,opacity:0}} animate={{x:0,opacity:1}} exit={{x:320,opacity:0}}
            transition={{type:'spring',stiffness:300,damping:30}}
            className="fixed right-0 top-14 bottom-0 w-72 bg-black/85 backdrop-blur-md border-l border-gold/15 flex flex-col z-40">
            <div className="flex items-center justify-between p-3 border-b border-gold/10">
              <p className="text-sm font-mughal text-gold tracking-widest">ROOM CHAT</p>
              <button onClick={() => setChatOpen(false)} className="text-ivory/30 hover:text-ivory"><X size={16}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 text-sm">
              {chatMessages.length === 0 && <p className="text-ivory/15 text-xs italic text-center mt-8">No messages yet…</p>}
              {chatMessages.map((m,i) => (
                <div key={i} className={clsx('flex gap-1.5', m.userId===myId&&'justify-end')}>
                  {m.userId!==myId&&<span className="text-gold text-xs shrink-0 font-mughal">{m.username}:</span>}
                  <span className={clsx('px-2 py-0.5 rounded-lg max-w-[80%] break-words text-xs',
                    m.userId===myId?'bg-gold text-felt-dark font-medium':'bg-white/10 text-ivory/70')}>{m.message}</span>
                </div>
              ))}
              <div ref={chatEndRef}/>
            </div>
            <form onSubmit={handleSendChat} className="p-3 border-t border-gold/10 flex gap-2">
              <input value={chatInput} onChange={e=>setChatInput(e.target.value)}
                className="input flex-1 text-xs py-1.5" placeholder="Say something…" maxLength={200}/>
              <button type="submit" className="btn-gold px-3 py-1.5 text-xs font-mughal">→</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
