// src/app/history/[sessionId]/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, SkipBack, SkipForward } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function ReplayPage() {
  const router = useRouter();
  const { sessionId } = useParams<{ sessionId: string }>();
  const { user } = useAuthStore();
  const [session, setSession] = useState<any>(null);
  const [tricks, setTricks] = useState<any[]>([]);
  const [step, setStep] = useState(0);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (!user) { router.replace('/auth/login'); return; }
    // Fetch session summary — history endpoint returns session + round data
    api.get(`/history`).then(r => {
      const s = r.data.history?.find((h:any) => h.session_id === sessionId);
      if (s) setSession(s);
    }).finally(() => setLoad(false));
  }, [user, sessionId]);

  if (load) return <div className="flex items-center justify-center min-h-[60vh]"><p className="text-gold animate-pulse font-mughal">Loading…</p></div>;
  if (!session) return <div className="text-center py-16 text-ivory/30">Session not found. <a href="/history" className="text-gold underline">Back to history</a></div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <button onClick={() => router.push('/history')}
        className="flex items-center gap-1 text-sm text-gold/60 hover:text-gold transition">
        <ChevronLeft size={14}/> Back to History
      </button>
      <div className="panel space-y-2">
        <h1 className="font-mughal text-xl text-gold">{session.theme_name} — Session</h1>
        <p className="text-xs text-ivory/40">Room {session.room_code} · {new Date(session.started_at).toLocaleDateString()}</p>
        <p className="text-xs text-ivory/40">{session.total_rounds} round{session.total_rounds!==1?'s':''}</p>
        <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold border ${
          session.result==='win' ? 'bg-green-900/30 text-green-400 border-green-700/30'
          : session.result==='loss' ? 'bg-crimson/20 text-crimson-light border-crimson/30'
          : 'bg-white/5 text-ivory/40 border-white/10'
        }`}>
          {session.result.toUpperCase()}
          {session.winner_username && ` · ${session.winner_username} won`}
        </div>
        {session.final_scores && (
          <div className="mt-3 space-y-1">
            <p className="text-xs text-gold/50 font-mughal tracking-wider uppercase">Final Scores</p>
            {Object.entries(session.final_scores as Record<string,number>)
              .sort(([,a],[,b]) => b-a)
              .map(([pid,score]) => (
                <div key={pid} className="flex justify-between text-sm">
                  <span className="text-ivory/60">{pid.startsWith('AI_')?'AI':pid.slice(0,8)}</span>
                  <span className="text-gold font-bold">{score} pts</span>
                </div>
              ))}
          </div>
        )}
      </div>
      <p className="text-xs text-ivory/30 text-center italic">Full move-by-move replay coming in next update</p>
    </div>
  );
}
