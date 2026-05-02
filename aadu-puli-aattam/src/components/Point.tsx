import React from "react";
import type { Point as PointType } from "../types/types";

const RADIUS = 10;

interface PointProps {
  point: PointType;
  isHighlighted?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Point: React.FC<PointProps> = ({
  point,
  isHighlighted = false,
  onClick,
  className = "",
}) => {
  return (
    <g
      className={className}
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <circle
        cx={point.x}
        cy={point.y}
        r={RADIUS}
        fill={isHighlighted ? "rgba(34, 197, 94, 0.5)" : "#FFFDD0"}
        stroke={isHighlighted ? "#22c55e" : "#78350f"}
        strokeWidth={isHighlighted ? 3 : 1}
        className="transition-all duration-200"
      />
    </g>
  );
};
