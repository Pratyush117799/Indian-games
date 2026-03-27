import React from "react";
import { useGameState } from "./hooks/useGameState";
import { GameBoard } from "./components/GameBoard";
import { PlayerInfo } from "./components/PlayerInfo";
import { ControlPanel } from "./components/ControlPanel";
import { VictoryModal } from "./components/VictoryModal";
import { GameHistory } from "./components/GameHistory";

function App() {
  const { state, selectPiece, placeGoat, movePiece, newGame } = useGameState();
  const [showRules, setShowRules] = React.useState(false);

  return (
    <div className="w-full min-h-screen flex flex-col items-center py-6 px-4">
      <header className="text-center mb-4">
        <h1 className="text-2xl md:text-3xl font-bold text-amber-900">
          ஆடு புலி ஆட்டம்
        </h1>
        <p className="text-sm text-amber-800 mt-1">Aadu Puli Aattam · Goats and Tigers</p>
      </header>

      <div className="mb-4">
        <ControlPanel onNewGame={newGame} onShowRules={() => setShowRules(true)} />
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start justify-center w-full max-w-6xl">
        <aside className="w-full lg:w-48 shrink-0 space-y-3 order-2 lg:order-1">
          <PlayerInfo state={state} />
          <GameHistory moves={state.moveHistory} />
        </aside>

        <main className="flex-1 flex justify-center order-1 lg:order-2">
          <GameBoard
            state={state}
            onSelectPiece={selectPiece}
            onPlaceGoat={placeGoat}
            onMovePiece={movePiece}
          />
        </main>
      </div>

      {state.winner && (
        <VictoryModal
          winner={state.winner}
          onClose={() => {
            newGame();
          }}
        />
      )}

      {showRules && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/60 p-4"
          onClick={() => setShowRules(false)}
          role="dialog"
          aria-modal
        >
          <div
            className="bg-amber-50 rounded-2xl border-4 border-amber-800 shadow-2xl p-6 max-w-lg max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-amber-900 mb-3">Rules</h2>
            <ul className="text-sm text-amber-800 space-y-2 list-disc list-inside">
              <li>Two players: <strong>Goats</strong> (15) vs <strong>Tigers</strong> (3).</li>
              <li>Goats move first. In the first phase, goats <strong>place</strong> one goat per turn on any empty point.</li>
              <li>Tigers can <strong>move</strong> to an adjacent empty point or <strong>capture</strong> a goat by jumping over it to an empty point beyond.</li>
              <li>After all 15 goats are placed, the <strong>movement phase</strong> begins: goats move one goat to an adjacent empty point each turn.</li>
              <li><strong>Tigers win</strong> by capturing 5 or more goats.</li>
              <li><strong>Goats win</strong> by trapping all 3 tigers (no legal moves left).</li>
            </ul>
            <button
              type="button"
              onClick={() => setShowRules(false)}
              className="mt-4 px-4 py-2 rounded-lg bg-amber-600 text-amber-50 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
