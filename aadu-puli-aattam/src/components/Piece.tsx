import React from "react";
import type { Piece as PieceType } from "../types/types";
import { POINTS } from "../utils/boardConfig";

interface PieceProps {
  piece: PieceType;
  isSelected?: boolean;
  onClick?: () => void;
}

const TIGER_R = 22;
const GOAT_R = 18;

export const Piece: React.FC<PieceProps> = ({ piece, isSelected, onClick }) => {
  if (piece.captured || piece.position === null) return null;

  const point = POINTS.find((p) => p.id === piece.position);
  if (!point) return null;

  const isTiger = piece.type === "tiger";
  const r = isTiger ? TIGER_R : GOAT_R;

  return (
    <g
      className="cursor-pointer transition-all duration-300"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      {isSelected && (
        <circle
          cx={point.x}
          cy={point.y}
          r={r + 6}
          fill="none"
          stroke="#eab308"
          strokeWidth={4}
          className="animate-pulse"
        />
      )}
      <circle
        cx={point.x}
        cy={point.y}
        r={r}
        fill={isTiger ? "#FF6347" : "#F5F5DC"}
        stroke={isTiger ? "#1f2937" : "#78350f"}
        strokeWidth={2}
      />
      <text
        x={point.x}
        y={point.y}
        textAnchor="middle"
        dominantBaseline="central"
        fill={isTiger ? "#fff" : "#444"}
        fontSize={isTiger ? 14 : 11}
        fontWeight="bold"
      >
        {isTiger ? piece.id.slice(1) : "G"}
      </text>
    </g>
  );
};
