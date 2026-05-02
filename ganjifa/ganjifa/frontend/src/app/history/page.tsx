// src/app/history/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, ChevronRight, Cpu } from 'lucide-react';
import { clsx } from 'clsx';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { HistoryEntry } from '@/types';

const R = { win:'bg-green-900/30 text-green-400 border-green-700/30', loss:'bg-crimson/20 text-crimson-light border-crimson/20', draw:'bg-white/5 text-ivory/40 border-white/10' };
const fmt = (s:number|null) => s ? `${Math.floor(s/60)}m ${s%60}s` : '—';

export default function HistoryPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    api.get('/history?limit=30').then(r => setEntries(r.data.history)).finally(() => setLoad(false));
  }, [user]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="text-gold" size={28}/>
        <div>
          <h1 className="font-mughal text-2xl text-gold">Game History</h1>
          <p className="text-sm text-ivory/40">Past matches & session scores</p>
        </div>
      </div>
      <div className="space-y-2">
        {load ? <div className="text-center py-16 text-ivory/20 animate-pulse text-sm">Loading…</div>
        : entries.length===0 ? <div className="panel text-center py-16 text-ivory/30 text-sm">No games yet — <a href="/lobby" className="text-gold underline">play now!</a></div>
        : entries.map(e => (
          <div key={e.session_id}
            onClick={() => router.push(`/history/${e.session_id}`)}
            className="panel flex items-center justify-between gap-4 hover:border-gold/30 transition cursor-pointer py-3 px-4">
            <div className="flex items-center gap-3">
              <span className={clsx('badge border text-xs', R[e.result])}>
                {e.result.charAt(0).toUpperCase()+e.result.slice(1)}
              </span>
              <div>
                <p className="font-semibold text-ivory text-sm flex items-center gap-1">
                  {e.theme_name}
                  {e.result==='win'&&<span className="text-gold">✦</span>}
                </p>
                <p className="text-xs text-ivory/40">
                  {e.total_rounds} rounds · {fmt(e.duration_secs)} · Room {e.room_code}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-ivory/20">
              <span className="text-xs">{new Date(e.started_at).toLocaleDateString()}</span>
              <ChevronRight size={14}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
