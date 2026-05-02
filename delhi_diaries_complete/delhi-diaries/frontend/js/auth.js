'use strict';
/*
 * auth.js — Login / Sign-up screen logic
 * Stores JWT in localStorage, loads save on login.
 */

const API = '/api';

/* ── State ── */
window.authState = {
  token: null,
  user:  null,
};

/* ── DOM refs ── */
const authScreen  = document.getElementById('auth-screen');
const gameScreen  = document.getElementById('game-screen');
const authError   = document.getElementById('auth-error');
const userInfoEl  = document.getElementById('user-info');
const saveStatus  = document.getElementById('save-status');

/* ── Tab switching ── */
let currentTab = 'login';

document.getElementById('tab-login').addEventListener('click', () => switchTab('login'));
document.getElementById('tab-register').addEventListener('click', () => switchTab('register'));

function switchTab(tab) {
  currentTab = tab;
  document.getElementById('tab-login').classList.toggle('active', tab === 'login');
  document.getElementById('tab-register').classList.toggle('active', tab === 'register');
  document.getElementById('login-form').style.display    = tab === 'login'    ? 'block' : 'none';
  document.getElementById('register-form').style.display = tab === 'register' ? 'block' : 'none';
  authError.textContent = '';
}

/* ── Login ── */
document.getElementById('login-btn').addEventListener('click', async () => {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  await doAuth('/api/auth/login', { username, password });
});

document.getElementById('login-password').addEventListener('keydown', e => {
  if (e.key === 'Enter') document.getElementById('login-btn').click();
});

/* ── Register ── */
document.getElementById('register-btn').addEventListener('click', async () => {
  const username  = document.getElementById('reg-username').value.trim();
  const password  = document.getElementById('reg-password').value;
  const password2 = document.getElementById('reg-password2').value;
  if (password !== password2) { authError.textContent = 'Passwords do not match'; return; }
  await doAuth('/api/auth/register', { username, password });
});

/* ── Guest play ── */
document.getElementById('guest-btn').addEventListener('click', () => {
  authState.token = null;
  authState.user  = { username: 'Guest', id: null };
  showGame(null);
});

/* ── Logout ── */
document.getElementById('btn-logout').addEventListener('click', () => {
  localStorage.removeItem('dd_token');
  authState.token = null;
  authState.user  = null;
  authScreen.style.display = 'flex';
  gameScreen.style.display = 'none';
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
  authError.textContent = '';
});

/* ── Core auth call ── */
async function doAuth(endpoint, body) {
  authError.textContent = '';
  try {
    const res  = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) { authError.textContent = data.error || 'Error'; return; }
    authState.token = data.token;
    authState.user  = data.user;
    localStorage.setItem('dd_token', data.token);
    /* Load save then show game */
    const saveData = await loadSaveFromServer();
    showGame(saveData);
  } catch (err) {
    authError.textContent = 'Network error — is the server running?';
  }
}

/* ── Load save ── */
async function loadSaveFromServer() {
  if (!authState.token) return null;
  try {
    const res = await fetch('/api/save', {
      headers: { Authorization: 'Bearer ' + authState.token },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.save || null;
  } catch { return null; }
}

/* ── Upload save ── */
window.saveGameToServer = async function(gameState) {
  if (!authState.token) { showSaveToast('Guest mode — progress not saved to server'); return; }
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + authState.token },
      body: JSON.stringify({ gameState }),
    });
    if (res.ok) showSaveToast('Game saved ✓');
    else showSaveToast('Save failed');
  } catch { showSaveToast('Save failed — offline?'); }
};

/* ── UI transitions ── */
function showGame(saveData) {
  authScreen.style.display = 'none';
  gameScreen.style.display = 'flex';
  userInfoEl.textContent = 'Logged in as: ' + authState.user.username;

  /* Boot game — passes save data if any */
  if (typeof window.initGame === 'function') window.initGame(saveData);
}

function showSaveToast(msg) {
  const t = document.createElement('div');
  t.className = 'save-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}

/* ── Auto-login on page load ── */
window.addEventListener('DOMContentLoaded', async () => {
  const stored = localStorage.getItem('dd_token');
  if (!stored) return;
  /* Validate stored token by trying to load save */
  try {
    const res = await fetch('/api/save', {
      headers: { Authorization: 'Bearer ' + stored },
    });
    if (!res.ok) { localStorage.removeItem('dd_token'); return; }
    const data = await res.json();
    /* Decode token payload for username */
    const payload = JSON.parse(atob(stored.split('.')[1]));
    authState.token = stored;
    authState.user  = { id: payload.id, username: payload.username };
    showGame(data.save || null);
  } catch { localStorage.removeItem('dd_token'); }
});
