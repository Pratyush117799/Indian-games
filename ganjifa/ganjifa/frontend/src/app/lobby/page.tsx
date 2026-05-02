'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { Copy, CheckCheck, Hash } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import type { ThemeSlug, Difficulty } from '@/types';

const THEMES = [
  { slug:'dashavatara' as ThemeSlug, name:'Dashavatara', emoji:'🪷', suits:10, cards:120 },
  { slug:'ramayana'    as ThemeSlug, name:'Ramayana',    emoji:'🏹', suits:8,  cards:96  },
  { slug:'geopolitics' as ThemeSlug, name:'Warfare',     emoji:'🚀', suits:10, cards:120 },
];
const DIFFICULTIES: { value:Difficulty; label:string; desc:string }[] = [
  { value:'easy',   label:'Easy',   desc:'Random plays 40% of time' },
  { value:'medium', label:'Medium', desc:'Smart trick-taking logic' },
  { value:'hard',   label:'Hard',   desc:'Card-counting, strategic' },
];

export default function LobbyPage() {
  const router       = useRouter();
  const params       = useSearchParams();
  const { user }     = useAuthStore();
  const [tab, setTab]= useState<'create'|'join'>('create');

  // Create form
  const [theme,      setTheme]     = useState<ThemeSlug>((params.get('theme') as ThemeSlug) || 'dashavatara');
  const [maxPlayers, setMax]       = useState(3);
  const [numRounds,  setRounds]    = useState(3);
  const [isVsAi,     setVsAi]      = useState(false);
  const [difficulty, setDiff]      = useState<Difficulty>('medium');
  const [hukmOn,     setHukm]      = useState(true);
  const [loading,    setLoading]   = useState(false);

  // Join form
  const [joinCode,   setJoinCode]  = useState('');
  const [copied,     setCopied]    = useState(false);
  const [createdCode,setCreated]   = useState<string|null>(null);

  useEffect(() => { if (!user) router.replace('/auth/login'); }, [user]);

  async function createRoom() {
    setLoading(true);
    try {
      const { data } = await api.post('/rooms', {
        themeSlug: theme, maxPlayers: isVsAi ? 2 : maxPlayers,
        numRounds, isVsAi, aiDifficulty: difficulty, hukmAllowed: hukmOn,
      });
      setCreated(data.roomCode);
      toast.success(`Room ${data.roomCode} created!`);
      router.push(`/game/${data.roomCode}`);
    } catch(err:any) { toast.error(err?.response?.data?.error||'Failed to create room'); }
    finally { setLoading(false); }
  }

  async function joinRoom(e: React.FormEvent) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    setLoading(true);
    try {
      await api.post(`/rooms/${code}/join`);
      router.push(`/game/${code}`);
    } catch(err:any) { toast.error(err?.response?.data?.error||'Could not join room'); }
    finally { setLoading(false); }
  }

  function copyCode() {
    if (!createdCode) return;
    navigator.clipboard.writeText(createdCode);
    setCopied(true); toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  }

  const ToggleRow = ({ label, value, onChange }: { label:string; value:boolean; onChange:(v:boolean)=>void }) => (
    <div className="flex items-center justify-between">
      <span className="text-sm text-ivory/70">{label}</span>
      <button onClick={() => onChange(!value)}
        className={clsx('w-12 h-6 rounded-full transition-colors duration-200 relative',
          value ? 'bg-gold' : 'bg-white/10')}>
        <span className={clsx('absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
          value ? 'translate-x-6' : 'translate-x-0.5')}/>
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
      <div className="text-center">
        <h1 className="font-mughal text-3xl text-gold">The Royal Court</h1>
        <p className="text-ivory/40 text-sm mt-1">Create or join a Ganjifa game</p>
      </div>

      {/* Tabs */}
      <div className="flex rounded-xl overflow-hidden border border-gold/20">
        {(['create','join'] as const).map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={clsx('flex-1 py-2.5 text-sm font-mughal tracking-wider transition',
              tab===t?'bg-gold text-felt-dark':'text-gold/60 hover:text-gold hover:bg-gold/10')}>
            {t==='create'?'✦ CREATE ROOM':'→ JOIN ROOM'}
          </button>
        ))}
      </div>

      {tab==='create' && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className="mughal-border bg-black/40 rounded-2xl p-6 space-y-6">

          {/* Theme */}
          <div className="space-y-2">
            <label className="text-xs text-gold/60 uppercase tracking-wider">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              {THEMES.map(t=>(
                <button key={t.slug} onClick={()=>setTheme(t.slug)}
                  className={clsx('rounded-xl border-2 p-3 text-center transition-all',
                    theme===t.slug?'border-gold bg-gold/10':'border-gold/15 hover:border-gold/30')}>
                  <div className="text-2xl mb-1">{t.emoji}</div>
                  <p className="text-xs font-semibold text-ivory/80">{t.name}</p>
                  <p className="text-[10px] text-gold/50">{t.cards} cards</p>
                </button>
              ))}
            </div>
          </div>

          {/* Vs AI toggle */}
          <ToggleRow label="Play vs AI" value={isVsAi} onChange={setVsAi}/>

          {/* AI Difficulty (if vs AI) */}
          {isVsAi && (
            <div className="space-y-2">
              <label className="text-xs text-gold/60 uppercase tracking-wider">AI Difficulty</label>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d=>(
                  <button key={d.value} onClick={()=>setDiff(d.value)}
                    className={clsx('flex-1 rounded-lg border-2 py-2 text-xs transition',
                      difficulty===d.value?'border-gold bg-gold/10 text-gold':'border-gold/15 text-ivory/50 hover:border-gold/30')}>
                    <p className="font-semibold">{d.label}</p>
                    <p className="opacity-60 mt-0.5 hidden sm:block">{d.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Players (multiplayer only) */}
          {!isVsAi && (
            <div>
              <label className="text-xs text-gold/60 uppercase tracking-wider">Players</label>
              <div className="flex gap-2 mt-2">
                {[2,3,4,5,6].map(n=>(
                  <button key={n} onClick={()=>setMax(n)}
                    className={clsx('flex-1 py-2 rounded-lg border-2 font-bold transition',
                      maxPlayers===n?'border-gold bg-gold/10 text-gold':'border-gold/15 text-ivory/50 hover:border-gold/30')}>
                    {n}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rounds */}
          <div>
            <label className="text-xs text-gold/60 uppercase tracking-wider">Rounds</label>
            <div className="flex gap-2 mt-2">
              {[1,2,3,5,7].map(n=>(
                <button key={n} onClick={()=>setRounds(n)}
                  className={clsx('flex-1 py-2 rounded-lg border-2 font-bold transition',
                    numRounds===n?'border-gold bg-gold/10 text-gold':'border-gold/15 text-ivory/50 hover:border-gold/30')}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Hukm toggle */}
          <ToggleRow label="Allow Hukm (Trump)" value={hukmOn} onChange={setHukm}/>

          <button onClick={createRoom} disabled={loading} className="btn-gold w-full py-3 text-base font-mughal tracking-wider">
            {loading ? 'Creating…' : 'CREATE ROOM →'}
          </button>
        </motion.div>
      )}

      {tab==='join' && (
        <motion.div initial={{opacity:0,y:8}} animate={{opacity:1,y:0}}
          className="mughal-border bg-black/40 rounded-2xl p-6 space-y-4">
          <p className="text-sm text-ivory/50">Enter the 6-character room code shared by the host.</p>
          <form onSubmit={joinRoom} className="space-y-3">
            <div className="relative">
              <Hash size={16} className="absolute left-3 top-3 text-gold/40"/>
              <input value={joinCode} onChange={e=>setJoinCode(e.target.value.toUpperCase().slice(0,6))}
                className="input pl-8 font-mono text-2xl tracking-[0.4em] text-center uppercase"
                placeholder="ABC123" maxLength={6}/>
            </div>
            <button type="submit" disabled={loading||joinCode.length!==6} className="btn-gold w-full py-3 font-mughal tracking-wider">
              {loading ? 'Joining…' : 'JOIN ROOM →'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
}
