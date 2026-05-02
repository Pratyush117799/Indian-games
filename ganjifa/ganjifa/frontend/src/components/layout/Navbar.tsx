'use client';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Trophy, Clock, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  return (
    <nav className="sticky top-0 z-50 bg-black/60 backdrop-blur-md border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-mughal text-xl text-gold tracking-widest hover:text-gold-light transition">
          ✦ GANJIFA ✦
        </Link>
        <div className="flex items-center gap-1 text-sm">
          {user ? (
            <>
              <Link href="/leaderboard" className="flex items-center gap-1 px-3 py-1.5 rounded text-ivory/70 hover:text-gold hover:bg-gold/10 transition">
                <Trophy size={14}/><span className="hidden sm:block">Leaderboard</span>
              </Link>
              <Link href="/history" className="flex items-center gap-1 px-3 py-1.5 rounded text-ivory/70 hover:text-gold hover:bg-gold/10 transition">
                <Clock size={14}/><span className="hidden sm:block">History</span>
              </Link>
              <Link href="/profile" className="flex items-center gap-1 px-3 py-1.5 rounded text-ivory/70 hover:text-gold hover:bg-gold/10 transition">
                <User size={14}/><span className="hidden sm:block text-gold">{user.username}</span>
              </Link>
              <button onClick={logout} className="px-3 py-1.5 rounded text-ivory/40 hover:text-crimson hover:bg-crimson/10 transition">
                <LogOut size={14}/>
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="px-3 py-1.5 rounded text-ivory/70 hover:text-gold transition">Login</Link>
              <Link href="/auth/register" className="btn-gold text-sm px-4 py-1.5">Join</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
