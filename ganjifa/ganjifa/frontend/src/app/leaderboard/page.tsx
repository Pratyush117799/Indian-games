// src/app/leaderboard/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Trophy, Star } from 'lucide-react';
import api from '@/lib/api';
import type { ThemeSlug, LeaderboardEntry } from '@/types';

const TABS: { slug: ThemeSlug; label: string; emoji: string }[] = [
  { slug:'dashavatara', label:'Dashavatara', emoji:'🪷' },
  { slug:'ramayana',    label:'Ramayana',    emoji:'🏹' },
  { slug:'geopolitics', label:'Warfare',     emoji:'🚀' },
];

export default function LeaderboardPage() {
  const [theme, setTheme] = useState<ThemeSlug>('dashavatara');
  const [data,  setData]  = useState<LeaderboardEntry[]>([]);
  const [load,  setLoad]  = useState(true);

  useEffect(() => {
    setLoad(true);
    api.get(`/leaderboard/${theme}`).then(r => setData(r.data.leaderboard)).finally(() => setLoad(false));
  }, [theme]);

  const medals = ['🥇','🥈','🥉'];

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center space-y-1">
        <Trophy className="mx-auto text-gold animate-float" size={36}/>
        <h1 className="font-mughal text-3xl text-gold">Hall of Champions</h1>
        <p className="text-ivory/40 text-sm">Top players by ELO rating · Multiplayer games only</p>
      </div>

      {/* Theme tabs */}
      <div className="flex gap-2 justify-center flex-wrap">
        {TABS.map(t => (
          <button key={t.slug} onClick={() => setTheme(t.slug)}
            className={clsx('px-4 py-1.5 rounded-full text-sm font-mughal tracking-wider transition border',
              theme===t.slug
                ? 'bg-gold text-felt-dark border-gold'
                : 'border-gold/20 text-gold/60 hover:border-gold/40 hover:text-gold')}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="mughal-border bg-black/40 rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-gold/15">
            <tr>
              {['#','Player','Rating','W','L','Tricks','Win%'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-mughal tracking-wider text-gold/50 uppercase">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {load ? (
              <tr><td colSpan={7} className="text-center py-12 text-ivory/20 animate-pulse text-sm">Loading…</td></tr>
            ) : data.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-ivory/20">No games played yet</td></tr>
            ) : data.map((e, i) => (
              <motion.tr key={e.id} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                transition={{delay:i*0.04}}
                className="border-b border-gold/5 hover:bg-gold/5 transition">
                <td className="px-4 py-3">
                  <span className={clsx('font-bold font-mughal', e.rank<=3?'text-xl':'text-ivory/40')}>
                    {e.rank<=3 ? medals[e.rank-1] : `#${e.rank}`}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold text-ivory">{e.username}</td>
                <td className="px-4 py-3">
                  <span className="flex items-center gap-1 text-gold">
                    <Star size={12}/>{e.rating}
                  </span>
                </td>
                <td className="px-4 py-3 text-green-400">{e.wins}</td>
                <td className="px-4 py-3 text-crimson-light">{e.losses}</td>
                <td className="px-4 py-3 text-ivory/50">{e.total_tricks}</td>
                <td className="px-4 py-3 text-ivory/60">{e.win_rate}%</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
