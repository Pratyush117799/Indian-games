import React, { useState, useCallback } from 'react';
import MainMenu from './components/screens/MainMenu';
import MapSelect from './components/screens/MapSelect';
import ModeSelect from './components/screens/ModeSelect';
import RaceResult from './components/screens/RaceResult';
import LeaderboardScreen from './components/screens/LeaderboardScreen';
import SettingsScreen from './components/screens/SettingsScreen';
import GameCanvas from './components/ui/GameCanvas';
import { usePlayerProfile } from './hooks/usePlayerProfile';
import { MAPS_LIST, MAPS_BY_ID } from './game/maps/index';
import './styles/main.css';

export default function App() {
  const [screen, setScreen] = useState('menu');
  const [selectedMap, setSelectedMap]   = useState(null);
  const [selectedMode, setSelectedMode] = useState('side');
  const [raceResult, setRaceResult]     = useState(null);

  const { profile, setUsername, setCarColor, recordRaceResult, isMapUnlocked } = usePlayerProfile();

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goMenu       = () => setScreen('menu');
  const goMapSelect  = () => setScreen('mapselect');
  const goLeaderboard = () => setScreen('leaderboard');
  const goSettings   = () => setScreen('settings');

  const handleMenuAction = (action) => {
    if (action === 'select')      goMapSelect();
    if (action === 'leaderboard') goLeaderboard();
    if (action === 'settings')    goSettings();
  };

  const handleMapSelect = (map) => {
    setSelectedMap(map);
    setScreen('modeselect');
  };

  const handleModeSelect = (mode) => {
    setSelectedMode(mode);
    setScreen('race');
  };

  // ── Race end ──────────────────────────────────────────────────────────────
  const handleRaceEnd = useCallback((result) => {
    if (!selectedMap) return;
    // Check for new unlock
    const MAP_ORDER = ['mumbai','delhi','himalaya','rajasthan','chennai'];
    const idx = MAP_ORDER.indexOf(selectedMap.id);
    let newUnlock = null;
    if (result.completed && idx >= 0 && idx < MAP_ORDER.length - 1) {
      const nextId = MAP_ORDER[idx + 1];
      if (!profile.unlockedMaps.includes(nextId)) newUnlock = MAPS_BY_ID[nextId]?.name;
    }
    if (result.completed && idx === MAP_ORDER.length - 1 && !profile.unlockedModes.includes('topdown')) {
      newUnlock = 'Top-Down Mode';
    }
    recordRaceResult({ ...result, mapId: selectedMap.id });
    setRaceResult({ ...result, newUnlock });
    setScreen('result');
  }, [selectedMap, profile, recordRaceResult]);

  const handleSetUsername = (username, carColor) => {
    setUsername(username, username, carColor || profile.carColor);
  };

  const handleSaveSettings = (name, color) => {
    setUsername(name, name, color);
    goMenu();
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      {screen === 'menu' && (
        <MainMenu profile={profile} onStartGame={handleMenuAction} onSetUsername={handleSetUsername} />
      )}
      {screen === 'mapselect' && (
        <MapSelect profile={profile} onSelect={handleMapSelect} onBack={goMenu} />
      )}
      {screen === 'modeselect' && selectedMap && (
        <ModeSelect map={selectedMap} profile={profile} onSelect={handleModeSelect} onBack={goMapSelect} />
      )}
      {screen === 'race' && selectedMap && (
        <GameCanvas
          map={selectedMap}
          mode={selectedMode}
          carColor={profile.carColor}
          onRaceEnd={handleRaceEnd}
        />
      )}
      {screen === 'result' && raceResult && selectedMap && (
        <RaceResult
          result={raceResult}
          map={selectedMap}
          mode={selectedMode}
          onPlayAgain={() => setScreen('race')}
          onMapSelect={goMapSelect}
          onMenu={goMenu}
        />
      )}
      {screen === 'leaderboard' && (
        <LeaderboardScreen profile={profile} onBack={goMenu} />
      )}
      {screen === 'settings' && (
        <SettingsScreen profile={profile} onSave={handleSaveSettings} onBack={goMenu} />
      )}
    </>
  );
}
