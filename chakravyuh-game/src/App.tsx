import React from "react";
import { GameBoard } from "./components/GameBoard";
import { ModeSwitch } from "./components/ModeSwitch";
import { ControlPanel } from "./components/ControlPanel";
import { StoryModal } from "./components/StoryModal";
import { TutorialOverlay } from "./components/TutorialOverlay";
import { useGameState } from "./hooks/useGameState";

const App: React.FC = () => {
  const game = useGameState();

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-4 bg-gradient-to-br from-amber-200/70 via-parchment to-amber-50 rounded-3xl shadow-[0_0_40px_rgba(0,0,0,0.12)] border border-amber-200/70">
      <header className="flex items-center justify-between border-b border-amber-400/60 pb-3">
        <div className="space-y-0.5">
          <h1 className="text-3xl font-semibold tracking-wide text-accent flex items-baseline gap-2">
            <span>Chakravyuh</span>
            <span className="text-lg text-amber-900">/ चक्रव्यूह</span>
          </h1>
          <p className="text-xs text-amber-900 tracking-wide uppercase">
            A Mahabharata-inspired strategic puzzle
          </p>
        </div>
        <ModeSwitch mode={game.mode} onChangeMode={game.setMode} />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <section className="lg:col-span-3 flex items-center justify-center">
          <GameBoard game={game} />
        </section>
        <section className="lg:col-span-1">
          <ControlPanel game={game} />
        </section>
      </main>

      <StoryModal open={game.showStoryModal} onStart={game.closeStoryModal} />
      <TutorialOverlay
        open={game.tutorialEnabled && game.showTutorial}
        step={game.tutorialStep}
        onNext={game.nextTutorialStep}
        onSkip={game.skipTutorial}
      />
    </div>
  );
};

export default App;

