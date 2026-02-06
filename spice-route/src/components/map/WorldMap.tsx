import React from "react";

interface Port {
  id: string;
  name: string;
  region: string;
  x: number; // 0-100 relative
  y: number; // 0-100 relative
  spices: string[];
  risk: "low" | "medium" | "high";
}

const SAMPLE_PORTS: Port[] = [
  { id: "muziris", name: "Muziris", region: "Kerala", x: 18, y: 72, spices: ["Pepper"], risk: "medium" },
  { id: "calicut", name: "Calicut", region: "Kerala", x: 22, y: 68, spices: ["Pepper", "Cardamom"], risk: "low" },
  { id: "aden", name: "Aden", region: "Arabia", x: 40, y: 60, spices: ["Mixed"], risk: "medium" },
  { id: "alexandria", name: "Alexandria", region: "Egypt", x: 62, y: 40, spices: ["Spice blends"], risk: "low" },
  { id: "rome", name: "Rome", region: "Mediterranean", x: 80, y: 26, spices: ["Luxury markets"], risk: "high" }
];

interface WorldMapProps {
  onBackToHarbor: () => void;
}

export const WorldMap: React.FC<WorldMapProps> = ({ onBackToHarbor }) => {
  const [hoveredPort, setHoveredPort] = React.useState<Port | null>(null);

  return (
    <div className="flex-1 relative bg-parchment overflow-hidden">
      <div className="absolute inset-0 map-background opacity-70" />
      <div className="relative h-full flex flex-col">
        <div className="flex items-center justify-between px-4 py-2 text-xs bg-amber-50/80 border-b border-amber-700/30">
          <div className="font-semibold text-amber-900 flex items-center gap-2">
            <span>Ancient Trade Routes</span>
            <span className="text-[10px] text-amber-700">
              Kerala → Arabia → Rome
            </span>
          </div>
          <button
            type="button"
            onClick={onBackToHarbor}
            className="px-3 py-1 rounded-full border border-amber-500 text-[11px] text-amber-900 bg-amber-100 hover:bg-amber-200"
          >
            ← Back to Harbor
          </button>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-4 rounded-[32px] border-4 border-amber-800/70 bg-amber-100/90 shadow-inner overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_0_0,rgba(254,243,199,0.5),transparent_60%),radial-gradient(circle_at_100%_100%,rgba(254,243,199,0.6),transparent_60%)] pointer-events-none" />
            <div className="relative w-full h-full">
              {SAMPLE_PORTS.map((port) => (
                <button
                  key={port.id}
                  type="button"
                  onMouseEnter={() => setHoveredPort(port)}
                  onMouseLeave={() => setHoveredPort((p) => (p?.id === port.id ? null : p))}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${port.x}%`, top: `${port.y}%` }}
                >
                  <div
                    className={`w-3 h-3 rounded-full border-2 shadow ${
                      port.risk === "low"
                        ? "bg-emerald-400 border-emerald-700"
                        : port.risk === "medium"
                        ? "bg-amber-400 border-amber-700"
                        : "bg-red-400 border-red-700"
                    }`}
                  />
                  <div className="mt-1 px-1 py-0.5 rounded bg-amber-900/90 text-amber-50 text-[9px]">
                    {port.name}
                  </div>
                </button>
              ))}
            </div>
          </div>
          {hoveredPort && (
            <div className="absolute left-4 bottom-4 max-w-xs parchment-panel rounded-2xl border border-amber-700/60 bg-amber-50/95 shadow-lg p-3 text-[11px]">
              <div className="font-semibold text-amber-900 mb-1">
                {hoveredPort.name} · {hoveredPort.region}
              </div>
              <div className="text-amber-800 mb-1">
                Spices: {hoveredPort.spices.join(", ")}
              </div>
              <div className="text-amber-700">
                Risk:{" "}
                <span
                  className={
                    hoveredPort.risk === "low"
                      ? "text-emerald-700"
                      : hoveredPort.risk === "medium"
                      ? "text-amber-700"
                      : "text-red-700"
                  }
                >
                  {hoveredPort.risk}
                </span>
              </div>
              <div className="mt-1 text-amber-900">
                “Gateway of pepper and stories from distant seas.”
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

