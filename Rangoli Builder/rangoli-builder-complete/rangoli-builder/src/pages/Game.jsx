// src/pages/Game.jsx
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft }              from "lucide-react";
import FreeBuildMode    from "../components/modes/FreeBuildMode";
import FestivalMode     from "../components/modes/FestivalMode";
import PuzzleMode       from "../components/modes/PuzzleMode";
import SymmetryChallenge from "../components/modes/SymmetryChallenge";
import PartBuildMode    from "../components/modes/PartBuildMode";
import XPToast          from "../components/ui/XPToast";

export default function Game() {
  const { mode, festivalId, difficulty } = useParams();
  const navigate = useNavigate();

  const BackBtn = () => (
    <button onClick={() => navigate("/")}
      className="fixed top-4 left-4 z-40 flex items-center gap-1.5 text-xs text-white/40
                 hover:text-white/80 transition-colors bg-black/40 backdrop-blur-sm
                 px-3 py-2 rounded-xl border border-white/10 hover:border-white/20">
      <ArrowLeft size={13} /> Home
    </button>
  );

  switch (mode) {
    case "free":
      return <><BackBtn /><XPToast /><FreeBuildMode festivalId={festivalId || "diwali"} /></>;
    case "festival":
      return <><BackBtn /><XPToast /><FestivalMode festivalId={festivalId || "diwali"} difficulty={difficulty || "easy"} /></>;
    case "puzzle":
      return <><BackBtn /><XPToast /><PuzzleMode festivalId={festivalId || "diwali"} patternId={new URLSearchParams(window.location.search).get("patternId")} /></>;
    case "symmetry":
      return <><BackBtn /><XPToast /><SymmetryChallenge festivalId={festivalId || "diwali"} /></>;
    case "partbuild":
      return <><BackBtn /><XPToast /><PartBuildMode festivalId={festivalId || "diwali"} difficulty={difficulty || "expert"} parts={3} timePerPart={300} /></>;
    default:
      return (
        <div className="min-h-screen flex items-center justify-center" style={{background:"#0F0A1E"}}>
          <div className="text-center">
            <p className="text-white/50 mb-4">Unknown mode: {mode}</p>
            <button onClick={() => navigate("/")} className="text-saffron hover:underline">← Home</button>
          </div>
        </div>
      );
  }
}
