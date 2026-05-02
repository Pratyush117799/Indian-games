'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';

const THEMES = [
  { slug:'dashavatara', name:'Dashavatara Ganjifa', nameHindi:'दशावतार',
    suits:10, cards:120, tagline:'10 incarnations of Lord Vishnu',
    color:'from-indigo to-indigo-light', border:'border-gold/40',
    emoji:'🪷', bg:'#2E0854' },
  { slug:'ramayana', name:'Ramayana Ganjifa', nameHindi:'रामायण',
    suits:8, cards:96, tagline:'Heroes & villains of the great epic',
    color:'from-crimson-dark to-crimson', border:'border-crimson/40',
    emoji:'🏹', bg:'#8B0000' },
  { slug:'geopolitics', name:'Modern Warfare Ganjifa', nameHindi:'आधुनिक युद्ध',
    suits:10, cards:120, tagline:'21st-century weapons platforms',
    color:'from-slate-900 to-slate-700', border:'border-slate-400/30',
    emoji:'🚀', bg:'#0A1628' },
];

export default function HomePage() {
  const { user } = useAuthStore();
  return (
    <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

      {/* Hero */}
      <motion.section className="text-center space-y-5"
        initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
        <p className="text-gold/60 font-mughal tracking-[0.3em] uppercase text-sm">
          The Royal Card Game of India
        </p>
        <h1 className="font-mughal text-5xl md:text-6xl text-gold leading-tight">
          GANJIFA
        </h1>
        <p className="font-devanagari text-2xl text-gold/60">गंजिफा</p>
        <p className="text-ivory/60 max-w-xl mx-auto text-sm leading-relaxed">
          Ancient Mughal trick-taking card game with hand-painted circular cards.
          Played since the 16th century. Now online with real-time multiplayer and AI.
        </p>
        {!user && (
          <div className="flex gap-3 justify-center pt-2">
            <Link href="/auth/register" className="btn-gold">Begin Your Journey</Link>
            <Link href="/auth/login"    className="btn-ghost">Sign In</Link>
          </div>
        )}
        {user && (
          <Link href="/lobby" className="btn-gold inline-block px-8 py-3 text-base">
            Enter the Court →
          </Link>
        )}
      </motion.section>

      {/* Theme cards */}
      <section className="grid md:grid-cols-3 gap-6">
        {THEMES.map((t,i) => (
          <motion.div key={t.slug}
            initial={{opacity:0,y:32}} animate={{opacity:1,y:0}}
            transition={{delay:0.15*(i+1),duration:0.5}}>
            <Link href={user ? `/lobby?theme=${t.slug}` : '/auth/login'}
              className={`block rounded-2xl border ${t.border} overflow-hidden
                          hover:shadow-[0_0_30px_rgba(218,165,32,0.3)] transition-all
                          hover:scale-[1.02] active:scale-[0.99] duration-200`}
              style={{ background: `linear-gradient(135deg, ${t.bg}ee, ${t.bg}99)` }}>
              <div className="p-6 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="text-4xl animate-float">{t.emoji}</div>
                  <div className="text-right">
                    <p className="text-xs text-gold/50 font-mughal">{t.suits} suits</p>
                    <p className="text-xs text-gold/50">{t.cards} cards</p>
                  </div>
                </div>
                <h2 className="font-mughal text-xl text-gold">{t.name}</h2>
                <p className="font-devanagari text-sm text-gold/40">{t.nameHindi}</p>
                <p className="text-ivory/50 text-sm">{t.tagline}</p>
                <p className="text-gold/60 text-xs mt-2 font-mughal tracking-wider">
                  {user ? 'PLAY NOW →' : 'LOGIN TO PLAY →'}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </section>

      {/* How to play strip */}
      <section className="mughal-border bg-black/40 rounded-2xl p-8">
        <h2 className="font-mughal text-2xl text-gold text-center mb-6">How to Play</h2>
        <div className="grid sm:grid-cols-4 gap-4 text-center text-sm">
          {[
            { step:'1', title:'Choose Theme', desc:'Pick Dashavatara, Ramayana, or Modern Warfare' },
            { step:'2', title:'Declare Hukm', desc:'The leader chooses a trump suit (or none)' },
            { step:'3', title:'Follow Suit', desc:'Play cards matching the led suit if you have one' },
            { step:'4', title:'Win Tricks', desc:'Highest card of led suit (or trump) takes the trick' },
          ].map(s => (
            <div key={s.step} className="space-y-1">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 text-gold font-mughal font-bold text-sm flex items-center justify-center mx-auto">
                {s.step}
              </div>
              <p className="text-gold font-semibold">{s.title}</p>
              <p className="text-ivory/40 text-xs">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
