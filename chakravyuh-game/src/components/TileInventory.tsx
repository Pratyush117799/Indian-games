import React from "react";
import { InventoryKey } from "../types/types";

interface TileInventoryProps {
  inventory: { [key: string]: number };
  selectedKey: InventoryKey | null;
  onSelect: (key: InventoryKey) => void;
}

export const TileInventory: React.FC<TileInventoryProps> = ({
  inventory,
  selectedKey,
  onSelect
}) => {
  const items: { key: InventoryKey; label: string; color: string }[] = [
    { key: "path-straight", label: "Straight Path", color: "bg-yellow-400" },
    { key: "path-corner", label: "Corner Path", color: "bg-yellow-400" },
    { key: "path-t", label: "T-Junction", color: "bg-yellow-400" },
    { key: "path-cross", label: "Cross", color: "bg-yellow-400" },
    { key: "wall", label: "Wall", color: "bg-red-700" },
    { key: "guard", label: "Guard", color: "bg-orange-500" }
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-amber-900 uppercase tracking-wide">
        Architect&apos;s Tiles / मार्ग
      </h3>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item) => {
          const count = inventory[item.key] ?? 0;
          const disabled = count <= 0;
          const isSelected = selectedKey === item.key;
          return (
            <button
              key={item.key}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(item.key)}
              className={`flex flex-col items-start justify-between p-2 rounded-lg border-2 shadow-sm text-left transition-all ${
                item.color
              } ${
                disabled
                  ? "opacity-40 cursor-not-allowed"
                  : "hover:brightness-110 cursor-pointer"
              } ${isSelected ? "ring-2 ring-blue-500 ring-offset-2" : ""}`}
            >
              <span className="text-xs font-semibold">{item.label}</span>
              <span className="text-[11px]">x{count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

