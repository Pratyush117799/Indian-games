import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'sadak_racer_profile';

const DEFAULT_PROFILE = {
  id: null,
  username: '',
  displayName: '',
  carColor: '#e74c3c',
  unlockedMaps: ['mumbai'],
  unlockedModes: ['side'],
  totalRaces: 0,
  totalWins: 0,
  bestSpeed: 0,
  totalScore: 0,
};

export function usePlayerProfile() {
  const [profile, setProfile] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? { ...DEFAULT_PROFILE, ...JSON.parse(raw) } : DEFAULT_PROFILE;
    } catch { return DEFAULT_PROFILE; }
  });

  const save = useCallback((next) => {
    setProfile(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  }, []);

  const setUsername = useCallback((username, displayName, carColor) => {
    const next = { ...profile, username, displayName: displayName || username, carColor: carColor || profile.carColor };
    save(next);
  }, [profile, save]);

  const setCarColor = useCallback((color) => {
    save({ ...profile, carColor: color });
  }, [profile, save]);

  const recordRaceResult = useCallback(({ completed, mapId, timeMs, maxSpeed, dist, score }) => {
    const next = {
      ...profile,
      totalRaces: profile.totalRaces + 1,
      totalWins: profile.totalWins + (completed ? 1 : 0),
      bestSpeed: Math.max(profile.bestSpeed, maxSpeed || 0),
      totalScore: (profile.totalScore || 0) + (score || 0),
    };
    // Unlock next map
    const MAP_ORDER = ['mumbai','delhi','himalaya','rajasthan','chennai'];
    if (completed) {
      const idx = MAP_ORDER.indexOf(mapId);
      if (idx >= 0 && idx < MAP_ORDER.length - 1) {
        const nextMap = MAP_ORDER[idx + 1];
        if (!next.unlockedMaps.includes(nextMap)) {
          next.unlockedMaps = [...next.unlockedMaps, nextMap];
        }
      }
      // All maps done → unlock top-down
      if (idx === MAP_ORDER.length - 1 && !next.unlockedModes.includes('topdown')) {
        next.unlockedModes = [...next.unlockedModes, 'topdown'];
      }
    }
    save(next);
  }, [profile, save]);

  const isMapUnlocked = useCallback((mapId) => {
    return profile.unlockedMaps.includes(mapId);
  }, [profile]);

  const isModeUnlocked = useCallback((mode) => {
    return profile.unlockedModes.includes(mode);
  }, [profile]);

  return { profile, setUsername, setCarColor, recordRaceResult, isMapUnlocked, isModeUnlocked };
}
