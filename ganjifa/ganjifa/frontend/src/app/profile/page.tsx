'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Trophy, Swords, Clock } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { ThemeSlug } from '@/types';

const THEMES: { slug:ThemeSlug; label:string; emoji:string }[] = [
  { slug:'dashavatara', label:'Dashavatara', emoji:'🪷' },
  { slug:'ramayana',    label:'Ramayana',    emoji:'🏹' },
  { slug:'geopolitics', label:'Warfare',     emoji:'🚀' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [stats, setStats]   = useState<Record<string,any>>({});
  const [load,  setLoad]    = useState(true);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    Promise.all(THEMES.map(t =>
      api.get(`/leaderboard/${t.slug}`).then(r => {
        const me = r.data.leaderboard?.find((e:any) => e.id === user.id);
        return [t.slug, me] as [string, any];
      }).catch(() => [t.slug, null] as [string, null])
    )).then(pairs => {
      const map: Record<string,any> = {};
      pairs.forEach(([slug, s]) => { if (s) map[slug] = s; });
      setStats(map);
    }).finally(() => setLoad(false));
  }, [user]);

  const fmt = (s:number|null) => s ? `${Math.floor(s/60)}m ${s%60}s` : '—';

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">
      {/* Avatar */}
      <div className="mughal-border bg-black/40 rounded-2xl p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 text-gold text-2xl font-mughal font-bold flex items-center justify-center">
          {user.username[0].toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-mughal text-xl text-gold">{user.username}</h1>
          <p className="text-sm text-ivory/40">{user.email}</p>
          <p className="text-xs text-ivory/25 mt-0.5">Member since {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <button onClick={logout} className="btn-ghost text-sm py-1.5 px-3">Log out</button>
      </div>

      {/* Per-theme stats */}
      {load ? <div className="text-center py-8 text-ivory/20 animate-pulse text-sm">Loading stats…</div>
      : THEMES.map(t => {
          const s = stats[t.slug];
          return (
            <div key={t.slug} className="space-y-3">
              <p className="font-mughal text-gold tracking-wider">{t.emoji} {t.label}</p>
              {!s ? (
                <p className="text-ivory/20 text-sm italic">No multiplayer games yet</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { icon:<Star size={16}/>,   label:'Rating',  value:s.rating,        sub:`Rank #${s.rank}` },
                    { icon:<Trophy size={16}/>,  label:'Win Rate',value:`${s.win_rate}%`, sub:`${s.wins}W/${s.losses}L` },
                    { icon:<Swords size={16}/>,  label:'Tricks',  value:s.total_tricks,  sub:'total won' },
                    { icon:<Clock size={16}/>,   label:'Games',   value:s.total_games,   sub:'played' },
                  ].map(st => (
                    <div key={st.label} className="panel flex items-center gap-3 py-3 px-4">
                      <div className="text-gold">{st.icon}</div>
                      <div>
                        <p className="text-lg font-bold text-gold leading-none">{st.value}</p>
                        <p className="text-xs text-ivory/40">{st.label}</p>
                        {st.sub&&<p className="text-xs text-ivory/25">{st.sub}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3">
        <a href="/lobby"       className="btn-gold text-center py-3 rounded-xl font-mughal tracking-wider">Play Now</a>
        <a href="/leaderboard" className="btn-ghost text-center py-3 rounded-xl font-mughal tracking-wider">Leaderboard</a>
      </div>
    </div>
  );
}
