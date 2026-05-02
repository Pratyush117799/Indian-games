'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import type { SuitDef } from '@/types';

// ── HukmDeclaration ───────────────────────────────────────────
interface HukmProps {
  suits:    SuitDef[];
  isLeader: boolean;
  onDeclare:(suit:string)=>void;
  onSkip:   ()=>void;
}

export function HukmDeclaration({ suits, isLeader, onDeclare, onSkip }: HukmProps) {
  return (
    <motion.div
      initial={{ opacity:0, scale:0.85 }}
      animate={{ opacity:1, scale:1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
    >
      <div className="mughal-border bg-felt-dark rounded-2xl p-8 max-w-xl w-full mx-4 shadow-hukm">
        <h2 className="text-2xl font-mughal text-gold text-center mb-2">
          ✦ Hukm Declaration ✦
        </h2>
        <p className="text-ivory/60 text-sm text-center mb-6">
          {isLeader
            ? 'You are the round leader. Declare a trump suit or play without one.'
            : 'Waiting for the round leader to declare Hukm…'}
        </p>

        {isLeader && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
              {suits.map(s => (
                <button key={s.slug} onClick={() => onDeclare(s.slug)}
                  className={clsx(
                    'rounded-xl border-2 p-3 text-center transition-all duration-200',
                    'hover:scale-105 active:scale-95 hover:shadow-hukm'
                  )}
                  style={{ borderColor: s.borderColor, background: `${s.bgColor}cc` }}
                >
                  <div className="text-2xl mb-1">{s.pipSymbol}</div>
                  <p className="text-xs font-semibold text-ivory/90 leading-tight">{s.name}</p>
                  <p className="text-[10px] capitalize mt-0.5"
                     style={{ color: s.borderColor }}>{s.type}</p>
                </button>
              ))}
            </div>
            <button onClick={onSkip}
              className="w-full btn-ghost text-sm py-2 mt-2">
              Play without Hukm (No Trump)
            </button>
          </>
        )}

        {!isLeader && (
          <div className="flex justify-center">
            <div className="dot-flash flex gap-1 text-gold text-2xl">
              <span>·</span><span>·</span><span>·</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ── HukmFlash overlay ─────────────────────────────────────────
export function HukmFlash({ suit, declaredBy }: { suit:string|null; declaredBy:string }) {
  return (
    <motion.div
      initial={{ opacity:0 }}
      animate={{ opacity:1 }}
      exit={{ opacity:0 }}
      className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center"
    >
      <motion.div
        initial={{ scale:0.5, opacity:0 }}
        animate={{ scale:1, opacity:1 }}
        exit={{ scale:1.5, opacity:0 }}
        className="bg-black/80 border-2 border-gold rounded-2xl px-8 py-5 text-center shadow-hukm hukm-flash"
      >
        <p className="text-gold font-mughal text-3xl mb-1">
          {suit ? `✦ ${suit.toUpperCase()} ✦` : '✦ NO HUKM ✦'}
        </p>
        <p className="text-ivory/60 text-sm">{declaredBy} declared trump</p>
      </motion.div>
    </motion.div>
  );
}

// ── ScoreStrip ────────────────────────────────────────────────
interface ScoreProps {
  playerIds: string[];
  usernames: Record<string,string>;
  tricksWon: Record<string,number>;
  sessionScores: Record<string,number>;
  myId: string;
  currentLeader: string;
  nextToPlay: string|null;
}

export function ScoreStrip({ playerIds,usernames,tricksWon,sessionScores,myId,currentLeader,nextToPlay }: ScoreProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {playerIds.map(pid => {
        const isMe      = pid===myId;
        const isNext    = pid===nextToPlay;
        const isLeader  = pid===currentLeader;
        const isAi      = pid.startsWith('AI_');
        const name      = isAi ? `AI${pid.replace('AI_','')}` : (usernames[pid]||pid.slice(0,8));
        return (
          <motion.div key={pid}
            animate={isNext ? { scale:1.05 } : { scale:1 }}
            className={clsx(
              'panel flex flex-col items-center px-3 py-2 min-w-[80px] transition-all',
              isMe   && 'border-gold/60',
              isNext && 'border-gold shadow-[0_0_12px_rgba(218,165,32,0.4)]',
            )}>
            <p className={clsx('text-xs font-semibold truncate max-w-[70px]',
              isMe?'text-gold':'text-ivory/80')}>
              {isMe?'You':name}
              {isLeader&&<span className="text-gold ml-1">♔</span>}
              {isNext&&<span className="text-gold-light ml-1 animate-pulse">●</span>}
            </p>
            <p className="text-xl font-mughal font-bold text-gold score-tick">
              {tricksWon[pid]||0}
            </p>
            <p className="text-xs text-ivory/40">
              {sessionScores[pid]||0} pts
            </p>
          </motion.div>
        );
      })}
    </div>
  );
}

// ── Round End Banner ──────────────────────────────────────────
export function RoundEndBanner({
  roundWinner, usernames, myId, currentRound, numRounds, onNextRound, isHost,
}: { roundWinner:string|null; usernames:Record<string,string>; myId:string;
    currentRound:number; numRounds:number; onNextRound:()=>void; isHost:boolean }) {
  const name = roundWinner
    ? (roundWinner.startsWith('AI_') ? 'AI' : (usernames[roundWinner]||'Player'))
    : null;
  const iWon = roundWinner === myId;
  return (
    <motion.div initial={{opacity:0,y:30}} animate={{opacity:1,y:0}}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="mughal-border bg-felt-dark rounded-2xl px-8 py-5 text-center shadow-hukm">
        <p className="text-gold font-mughal text-xl mb-1">
          {name ? (iWon ? '✦ You won the round! ✦' : `✦ ${name} won the round ✦`) : '✦ Tied round ✦'}
        </p>
        <p className="text-ivory/50 text-sm mb-3">
          Round {currentRound} of {numRounds} complete
        </p>
        {isHost && (
          <button onClick={onNextRound} className="btn-gold text-sm px-6 py-2">
            {currentRound < numRounds ? 'Next Round →' : 'Final Results →'}
          </button>
        )}
        {!isHost && <p className="text-ivory/40 text-xs">Waiting for host…</p>}
      </div>
    </motion.div>
  );
}

// ── Game Over Modal ───────────────────────────────────────────
export function GameOverModal({
  gameWinner, usernames, myId, finalScores, onPlayAgain,
}: { gameWinner:string|null; usernames:Record<string,string>; myId:string;
    finalScores:Record<string,number>; onPlayAgain:()=>void }) {
  const iWon  = gameWinner===myId;
  const isAi  = gameWinner?.startsWith('AI_');
  const name  = isAi ? 'AI' : (usernames[gameWinner||'']||'Unknown');
  const sorted = Object.entries(finalScores).sort(([,a],[,b])=>b-a);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">

      {/* Win rain particles */}
      {iWon && Array.from({length:20},(_,i)=>(
        <div key={i} className="win-particle"
          style={{ left:`${Math.random()*100}%`, animationDuration:`${1.5+Math.random()*2}s`,
                   animationDelay:`${Math.random()*2}s`, fontSize:`${16+Math.random()*16}px` }}>
          {['✦','🏵','♦','✿'][Math.floor(Math.random()*4)]}
        </div>
      ))}

      <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}}
        className="mughal-border bg-felt-dark rounded-3xl p-8 max-w-md w-full mx-4 text-center shadow-hukm">
        <div className="text-6xl mb-3">{iWon?'🏆':'🎴'}</div>
        <h2 className="font-mughal text-3xl text-gold mb-1">
          {gameWinner ? (iWon?'You Win!':isAi?'AI Wins':'Defeat') : 'Draw!'}
        </h2>
        {gameWinner && <p className="text-ivory/60 mb-4">{iWon?'Excellent play!':name+' wins this game'}</p>}

        {/* Final scores */}
        <div className="space-y-2 mb-6">
          {sorted.map(([pid,score],i)=>{
            const isWinner=pid===gameWinner;
            const pName=pid.startsWith('AI_')?'AI':(usernames[pid]||pid.slice(0,8));
            return (
              <div key={pid} className={clsx('flex items-center justify-between px-4 py-2 rounded-xl',
                isWinner?'bg-gold/20 border border-gold/40':'bg-black/20')}>
                <span className={clsx('font-semibold',isWinner?'text-gold':'text-ivory/70')}>
                  {i===0?'🥇':i===1?'🥈':'🥉'} {pid===myId?'You':pName}
                </span>
                <span className={clsx('font-mughal font-bold text-lg',isWinner?'text-gold':'text-ivory/50')}>
                  {score} {score===1?'pt':'pts'}
                </span>
              </div>
            );
          })}
        </div>
        <button onClick={onPlayAgain} className="btn-gold w-full py-3 text-base">
          Play Again
        </button>
      </motion.div>
    </motion.div>
  );
}
