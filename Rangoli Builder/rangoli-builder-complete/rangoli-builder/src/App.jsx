import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home        from "./pages/Home";
import Game        from "./pages/Game";
import Gallery     from "./pages/Gallery";
import Leaderboard from "./pages/Leaderboard";
import Lobby       from "./pages/Lobby";
import GameRoom    from "./pages/GameRoom";
import Auth        from "./pages/Auth";
import Profile     from "./pages/Profile";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"                                   element={<Home />} />
        <Route path="/auth"                               element={<Auth />} />
        <Route path="/profile"                            element={<Profile />} />
        <Route path="/game/:mode/:festivalId/:difficulty" element={<Game />} />
        <Route path="/game/:mode/:festivalId"             element={<Game />} />
        <Route path="/game/:mode"                         element={<Game />} />
        <Route path="/gallery"                            element={<Gallery />} />
        <Route path="/leaderboard"                        element={<Leaderboard />} />
        <Route path="/lobby"                              element={<Lobby />} />
        <Route path="/room/:roomCode"                     element={<GameRoom />} />
        <Route path="*"                                   element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
