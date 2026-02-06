import React, { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { PlayHub } from './pages/PlayHub';
import { LorePage } from './pages/LorePage';

// Main App Controller
function App() {
    // Current Scene State
    const [scene, setScene] = useState<'landing' | 'play' | 'lore'>('landing');

    // Scene Router
    if (scene === 'play') {
        return <PlayHub onBack={() => setScene('landing')} />;
    }

    if (scene === 'lore') {
        return <LorePage onBack={() => setScene('landing')} />;
    }

    // Default: Cinematic Landing Page
    return <LandingPage onNavigate={(view) => {
        if (view === 'home') setScene('landing');
        else setScene(view);
    }} />;
}

export default App;


