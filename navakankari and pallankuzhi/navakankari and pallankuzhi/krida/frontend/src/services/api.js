/**
 * api.js — Axios-like API wrapper
 * Uses fetch under the hood; base URL auto-detected from env.
 */

const BASE = import.meta.env.VITE_API_URL ?? '/api'

const request = async (method, path, body) => {
  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) opts.body = JSON.stringify(body)

  const stored = localStorage.getItem('krida_player')
  if (stored) {
    const { tagId } = JSON.parse(stored)
    if (tagId) opts.headers['X-Player-Tag'] = tagId
  }

  const res = await fetch(`${BASE}${path}`, opts)
  if (!res.ok) throw new Error(`API ${method} ${path} failed: ${res.status}`)
  return { data: await res.json() }
}

const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, body)  => request('POST',   path, body),
  patch:  (path, body)  => request('PATCH',  path, body),
  delete: (path)        => request('DELETE', path),
}

export default api
