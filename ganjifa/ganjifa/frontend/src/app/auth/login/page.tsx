'use client';
// src/app/auth/login/page.tsx
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [form, setForm] = useState({ email:'', password:'' });
  const [error, setError] = useState('');

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setError('');
    try { await login(form.email, form.password); toast.success('Welcome back!'); router.push('/'); }
    catch(err:any) { setError(err?.response?.data?.error || 'Login failed'); }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="mughal-border bg-black/60 backdrop-blur rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-5xl mb-2">🎴</p>
          <h1 className="font-mughal text-2xl text-gold">Welcome Back</h1>
          <p className="text-ivory/40 text-sm font-devanagari">गंजिफा में आपका स्वागत है</p>
        </div>
        {error && <div className="bg-crimson/20 border border-crimson/40 text-ivory text-sm px-4 py-2.5 rounded-lg">{error}</div>}
        <form onSubmit={submit} className="space-y-4">
          <div><label className="text-xs text-gold/60 uppercase tracking-wider block mb-1">Email</label>
            <input type="email" required className="input" placeholder="you@example.com"
              value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
          <div><label className="text-xs text-gold/60 uppercase tracking-wider block mb-1">Password</label>
            <input type="password" required className="input" placeholder="••••••••"
              value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
          <button type="submit" disabled={isLoading} className="btn-gold w-full py-3">
            {isLoading ? 'Signing in…' : 'Enter the Court'}
          </button>
        </form>
        <p className="text-center text-sm text-ivory/40">
          New to Ganjifa?{' '}
          <Link href="/auth/register" className="text-gold hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
