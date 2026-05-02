import React from "react";
import { Position, Tile } from "../types/types";
import { WarriorPiece } from "./WarriorPiece";

interface TileProps {
  tile: Tile;
  mode: "building" | "solving" | "victory" | "defeat" | "menu";
  isWarriorHere: boolean;
  isValidMoveTarget: boolean;
  sanskritEnabled?: boolean;
  onClick: (pos: Position) => void;
  onRightClick: (pos: Position) => void;
}

export const TileCell: React.FC<TileProps> = ({
  tile,
  mode,
  isWarriorHere,
  isValidMoveTarget,
  sanskritEnabled,
  onClick,
  onRightClick
}) => {
  const handleClick = () => {
    onClick(tile.position);
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onRightClick(tile.position);
  };

  let baseColor = "bg-slate-300 border-slate-400";

  if (tile.type === "path") baseColor = "bg-yellow-400 border-yellow-600";
  if (tile.type === "wall") baseColor = "bg-red-700 border-red-900";
  if (tile.type === "guard") baseColor = "bg-orange-500 border-orange-700";
  if (tile.type === "entry" || tile.type === "exit" || tile.type === "center") {
    baseColor = "bg-yellow-300 border-yellow-500";
  }

  const moveHighlight =
    mode === "solving" && isValidMoveTarget ? "ring-2 ring-green-400 ring-offset-1" : "";

  const disabledOverlay =
    mode === "victory" || mode === "defeat" ? "opacity-70" : "";

  const rotationStyle = {
    transform: `rotate(${tile.rotation}deg)`
  };

  const isSpecial = tile.type === "entry" || tile.type === "exit" || tile.type === "center";

  let title: string | undefined;
  if (sanskritEnabled) {
    if (tile.type === "path") title = "मार्ग (maarg) — path";
    else if (tile.type === "wall") title = "दीवार (deevaar) — wall";
    else if (tile.type === "guard") title = "रक्षक (rakshak) — guard";
    else if (tile.type === "entry") title = "प्रवेश द्वार (pravesh dvaar) — entry gate";
    else if (tile.type === "exit") title = "निर्गम (nirgam) — exit";
    else if (tile.type === "center") title = "बीज (beej) — center/seed";
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      title={title}
      className={`relative w-14 h-14 rounded-lg border-2 ${baseColor} shadow-md hover:brightness-110 tile ${moveHighlight} ${disabledOverlay} flex items-center justify-center overflow-hidden`}
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={rotationStyle}
      >
        {tile.type === "wall" && (
          <div className="w-full h-full brick-texture" />
        )}
        {tile.type === "guard" && (
          <div className="w-4/5 h-4/5 rounded-full border-2 border-orange-900 guard-aura flex items-center justify-center">
            <span className="text-[10px] font-semibold text-amber-50">र</span>
          </div>
        )}
        {(tile.type === "path" || isSpecial) && (
          <svg
            className="w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid meet"
          >
            {/* subtle mandala rings for center */}
            {tile.type === "center" && (
              <>
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="fill-none stroke-amber-700/60"
                  strokeWidth="3"
                  strokeDasharray="4 4"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="24"
                  className="fill-none stroke-amber-700/60"
                  strokeWidth="2"
                  strokeDasharray="2 6"
                />
              </>
            )}

            {/* Path strokes based on connections */}
            {tile.connections.north && (
              <path
                d="M50 10 L50 50"
                className="path-stroke"
              />
            )}
            {tile.connections.south && (
              <path
                d="M50 50 L50 90"
                className="path-stroke"
              />
            )}
            {tile.connections.east && (
              <path
                d="M50 50 L90 50"
                className="path-stroke"
              />
            )}
            {tile.connections.west && (
              <path
                d="M10 50 L50 50"
                className="path-stroke"
              />
            )}

            {/* arrows for flow */}
            {tile.connections.north && (
              <polygon
                points="50,14 46,22 54,22"
                className="fill-amber-900/80"
              />
            )}
            {tile.connections.south && (
              <polygon
                points="50,86 46,78 54,78"
                className="fill-amber-900/80"
              />
            )}
            {tile.connections.east && (
              <polygon
                points="86,50 78,46 78,54"
                className="fill-amber-900/80"
              />
            )}
            {tile.connections.west && (
              <polygon
                points="14,50 22,46 22,54"
                className="fill-amber-900/80"
              />
            )}
          </svg>
        )}

        {isSpecial && (
          <div className="absolute inset-1 rounded-full border border-amber-500/70 center-glow" />
        )}
      </div>

      {(tile.type === "entry" || tile.type === "exit" || tile.type === "center") && (
        <span className="relative z-10 text-[11px] font-semibold text-amber-900 drop-shadow-sm">
          {tile.type === "entry" && "द्वार"}
          {tile.type === "exit" && "निर्गम"}
          {tile.type === "center" && "बीज"}
        </span>
      )}

      {isWarriorHere && <WarriorPiece />}
    </button>
  );
};

