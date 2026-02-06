import React from "react";
import { NavBar } from "./components/layout/NavBar";
import { LobbyScreen } from "./components/lobby/LobbyScreen";
import { WorldMap } from "./components/map/WorldMap";

type View = "lobby" | "map";

const App: React.FC = () => {
  const [view, setView] = React.useState<View>("lobby");

  return (
    <div className="flex flex-col w-full">
      <NavBar currentView={view} onNavigate={setView} />
      {view === "lobby" ? (
        <LobbyScreen
          onPlayOnline={() => setView("map")}
          onPlayFriends={() => setView("map")}
          onPlayAI={() => setView("map")}
          onPractice={() => setView("map")}
        />
      ) : (
        <WorldMap onBackToHarbor={() => setView("lobby")} />
      )}
    </div>
  );
};

export default App;

