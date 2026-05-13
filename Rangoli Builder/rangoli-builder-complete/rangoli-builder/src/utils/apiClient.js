// src/utils/apiClient.js
import axios from "axios";

const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,        // send httpOnly refresh cookie
  timeout:         10000,
});

// ── Request interceptor — attach access token ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor — auto-refresh on 401 ────────────────────────────
let isRefreshing    = false;
let refreshQueue    = [];          // queued requests waiting for new token

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;
    if (err.response?.status !== 401 || original._retry) {
      return Promise.reject(err);
    }

    if (isRefreshing) {
      // Queue this request until refresh resolves
      return new Promise((resolve, reject) => {
        refreshQueue.push({ resolve, reject });
      }).then(token => {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      });
    }

    original._retry  = true;
    isRefreshing     = true;

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      const newToken = data.accessToken;
      localStorage.setItem("accessToken", newToken);

      // Flush queue
      refreshQueue.forEach(p => p.resolve(newToken));
      refreshQueue = [];

      original.headers.Authorization = `Bearer ${newToken}`;
      return api(original);
    } catch {
      // Refresh failed — clear session
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      refreshQueue.forEach(p => p.reject(new Error("Session expired")));
      refreshQueue = [];
      window.location.href = "/";
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

// ── Typed API helpers ─────────────────────────────────────────────────────

export const authAPI = {
  register: (data)    => api.post("/auth/register", data),
  login:    (data)    => api.post("/auth/login",    data),
  logout:   ()        => api.post("/auth/logout"),
};

export const patternAPI = {
  list:   (params)    => api.get("/patterns",      { params }),
  get:    (id)        => api.get(`/patterns/${id}`),
  create: (data)      => api.post("/patterns",     data),
  update: (id, data)  => api.put(`/patterns/${id}`, data),
  delete: (id)        => api.delete(`/patterns/${id}`),
  like:   (id)        => api.post(`/patterns/${id}/like`),
};

export const festivalAPI = {
  list:     ()        => api.get("/festivals"),
  patterns: (slug)    => api.get(`/festivals/${slug}/patterns`),
  today:    ()        => api.get("/festivals/challenges/today"),
};

export const gameAPI = {
  submit:   (data)    => api.post("/game/submit",  data),
  sessions: (params)  => api.get("/game/sessions", { params }),
};

export const leaderboardAPI = {
  global:   (params)  => api.get("/leaderboard/global",      { params }),
  festival: (f, p)    => api.get(`/leaderboard/${f}`,        { params: p }),
};

export default api;
