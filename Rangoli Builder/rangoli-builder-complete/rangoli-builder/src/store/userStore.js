// src/store/userStore.js
import { create }   from "zustand";
import { authAPI }  from "../utils/apiClient";

const useUserStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────────────
  user:            null,
  accessToken:     localStorage.getItem("accessToken") || null,
  isAuthenticated: !!localStorage.getItem("accessToken"),
  loading:         false,
  error:           null,

  // ── Auth actions ───────────────────────────────────────────────────────
  register: async ({ username, email, password }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.register({ username, email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId",      data.user.id);
      set({ user: data.user, accessToken: data.accessToken,
            isAuthenticated: true, loading: false });
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Registration failed";
      set({ error: msg, loading: false });
      return { ok: false, error: msg };
    }
  },

  login: async ({ email, password }) => {
    set({ loading: true, error: null });
    try {
      const { data } = await authAPI.login({ email, password });
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("userId",      data.user.id);
      set({ user: data.user, accessToken: data.accessToken,
            isAuthenticated: true, loading: false });
      return { ok: true };
    } catch (err) {
      const msg = err.response?.data?.error || "Login failed";
      set({ error: msg, loading: false });
      return { ok: false, error: msg };
    }
  },

  logout: async () => {
    try { await authAPI.logout(); } catch { /* silent */ }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userId");
    set({ user: null, accessToken: null, isAuthenticated: false });
  },

  setUser:  (user) => set({ user }),
  addXP:    (xp)   => set(s => ({
    user: s.user ? { ...s.user, xp: (s.user.xp || 0) + xp } : s.user
  })),
  clearError: ()   => set({ error: null }),
}));

export default useUserStore;
