import React from "react";
import type { Edge as EdgeType } from "../types/types";
import { POINTS } from "../utils/boardConfig";

interface EdgeProps {
  edge: EdgeType;
  className?: string;
}

export const Edge: React.FC<EdgeProps> = ({ edge, className = "" }) => {
  const from = POINTS.find((p) => p.id === edge.from);
  const to = POINTS.find((p) => p.id === edge.to);
  if (!from || !to) return null;
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      className={className}
      strokeWidth={3}
      stroke="currentColor"
    />
  );
};
