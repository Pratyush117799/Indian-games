'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [form, setForm] = useState({ username:'', email:'', password:'' });
  const [errors, setErrors] = useState<Record<string,string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setErrors({});
    try {
      await register(form.username, form.email, form.password);
      toast.success('Welcome to Ganjifa!'); router.push('/');
    } catch(err:any) {
      const apiErr = err?.response?.data?.errors;
      if (Array.isArray(apiErr)) {
        const map: Record<string,string> = {};
        apiErr.forEach((e:any) => { map[e.path] = e.msg; });
        setErrors(map);
      } else setErrors({ global: err?.response?.data?.error || 'Registration failed' });
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="mughal-border bg-black/60 backdrop-blur rounded-2xl p-8 w-full max-w-md space-y-6">
        <div className="text-center">
          <p className="text-5xl mb-2">🏵</p>
          <h1 className="font-mughal text-2xl text-gold">Join the Court</h1>
          <p className="text-ivory/40 text-sm">Create your Ganjifa account</p>
        </div>
        {errors.global && <div className="bg-crimson/20 border border-crimson/40 text-ivory text-sm px-4 py-2.5 rounded-lg">{errors.global}</div>}
        <form onSubmit={submit} className="space-y-4">
          {([['username','Username','text','e.g. mughal_player'],['email','Email','email','you@example.com'],['password','Password','password','Min 8 chars, 1 uppercase, 1 number']] as const).map(([id,label,type,ph])=>(
            <div key={id}>
              <label className="text-xs text-gold/60 uppercase tracking-wider block mb-1">{label}</label>
              <input type={type} required className="input" placeholder={ph}
                value={(form as any)[id]} onChange={e=>setForm({...form,[id]:e.target.value})}/>
              {errors[id] && <p className="text-crimson text-xs mt-1">{errors[id]}</p>}
            </div>
          ))}
          <button type="submit" disabled={isLoading} className="btn-gold w-full py-3">
            {isLoading ? 'Creating…' : 'Enter the Court'}
          </button>
        </form>
        <p className="text-center text-sm text-ivory/40">
          Already a player?{' '}
          <Link href="/auth/login" className="text-gold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
