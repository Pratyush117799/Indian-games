// src/pages/Auth.jsx
import { useState }       from "react";
import { useNavigate }    from "react-router-dom";
import { Eye, EyeOff }    from "lucide-react";
import useUserStore       from "../store/userStore";

export default function Auth() {
  const navigate              = useNavigate();
  const { login, register,
          loading, error,
          clearError }         = useUserStore();
  const [tab, setTab]          = useState("login");
  const [showPass, setShowPass] = useState(false);

  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const update = (k) => (e) => {
    clearError();
    setForm(f => ({ ...f, [k]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = tab === "login"
      ? await login({ email: form.email, password: form.password })
      : await register({ username: form.username, email: form.email, password: form.password });
    if (result.ok) navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
         style={{ background: "linear-gradient(135deg,#0F0A1E,#1a0a2e)" }}>
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3" style={{ filter: "drop-shadow(0 0 20px rgba(232,93,4,0.8))" }}>🎨</div>
          <h1 className="text-2xl font-bold text-white">
            Rangoli <span style={{ color: "#E85D04" }}>Builder</span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Smart India Hackathon</p>
        </div>

        {/* Card */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-7">
          {/* Tab switcher */}
          <div className="flex mb-6 bg-white/5 rounded-2xl p-1">
            {["login","register"].map(t => (
              <button key={t} onClick={() => { setTab(t); clearError(); }}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all
                  ${tab === t ? "bg-saffron text-white shadow-lg" : "text-white/50 hover:text-white/80"}`}>
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === "register" && (
              <Field label="Username" type="text" value={form.username}
                onChange={update("username")} placeholder="your_name" required />
            )}
            <Field label="Email" type="email" value={form.email}
              onChange={update("email")} placeholder="you@example.com" required />

            {/* Password with show/hide */}
            <div>
              <label className="text-xs text-white/50 mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  required minLength={6}
                  className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3
                             text-white text-sm placeholder-white/25 pr-11
                             focus:outline-none focus:border-saffron/60
                             transition-colors"
                />
                <button type="button" onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                            rounded-xl px-4 py-2.5">{error}</p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm
                         transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: "linear-gradient(135deg,#E85D04,#C74D00)" }}>
              {loading ? "Please wait…" : tab === "login" ? "Sign In 🎨" : "Create Account 🌸"}
            </button>
          </form>

          {/* Guest option */}
          <div className="mt-5 pt-5 border-t border-white/10 text-center">
            <button onClick={() => navigate("/")}
              className="text-xs text-white/30 hover:text-white/60 transition-colors">
              Continue as Guest →
            </button>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs mt-5">
          Part of Krida — Indian Cultural Games
        </p>
      </div>
    </div>
  );
}

function Field({ label, type, value, onChange, placeholder, required }) {
  return (
    <div>
      <label className="text-xs text-white/50 mb-1.5 block">{label}</label>
      <input
        type={type} value={value} onChange={onChange}
        placeholder={placeholder} required={required}
        className="w-full bg-white/8 border border-white/15 rounded-xl px-4 py-3
                   text-white text-sm placeholder-white/25
                   focus:outline-none focus:border-saffron/60 transition-colors"
      />
    </div>
  );
}
