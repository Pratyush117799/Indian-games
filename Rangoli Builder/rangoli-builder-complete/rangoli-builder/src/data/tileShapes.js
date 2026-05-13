// data/tileShapes.js
// Each shape is rendered as an SVG element centred at (0,0),
// scaled to fit a ~24px bounding box.

export const TILE_SHAPES = [
  {
    id: "dot",
    label: "Dot",
    emoji: "⬤",
    render: ({ x, y, color, size = 10 }) => (
      `<circle cx="${x}" cy="${y}" r="${size * 0.45}" fill="${color}" />`
    ),
    Component: "circle",
    defaultProps: (x, y, color, size) => ({ cx: x, cy: y, r: size * 0.45, fill: color }),
  },
  {
    id: "petal",
    label: "Petal",
    emoji: "🌸",
    // Elongated ellipse rotated to point outward from center
    Component: "ellipse",
    defaultProps: (x, y, color, size, rotation = 0) => ({
      cx: x, cy: y,
      rx: size * 0.22, ry: size * 0.45,
      fill: color,
      transform: `rotate(${rotation} ${x} ${y})`,
    }),
  },
  {
    id: "diamond",
    label: "Diamond",
    emoji: "♦",
    Component: "polygon",
    defaultProps: (x, y, color, size) => ({
      points: `${x},${y - size * 0.48} ${x + size * 0.28},${y} ${x},${y + size * 0.48} ${x - size * 0.28},${y}`,
      fill: color,
    }),
  },
  {
    id: "arc",
    label: "Arc",
    emoji: "🌙",
    Component: "path",
    defaultProps: (x, y, color, size, rotation = 0) => {
      const r = size * 0.42;
      // Crescent arc path
      const d = `M ${x - r * 0.6} ${y - r * 0.3}
                 A ${r} ${r} 0 1 1 ${x + r * 0.6} ${y - r * 0.3}
                 A ${r * 0.6} ${r * 0.6} 0 1 0 ${x - r * 0.6} ${y - r * 0.3} Z`;
      return { d, fill: color, transform: `rotate(${rotation} ${x} ${y})` };
    },
  },
  {
    id: "star",
    label: "Star",
    emoji: "⭐",
    Component: "polygon",
    defaultProps: (x, y, color, size) => {
      const pts = [];
      for (let i = 0; i < 10; i++) {
        const angle  = (i * Math.PI) / 5 - Math.PI / 2;
        const radius = i % 2 === 0 ? size * 0.45 : size * 0.2;
        pts.push(`${x + radius * Math.cos(angle)},${y + radius * Math.sin(angle)}`);
      }
      return { points: pts.join(" "), fill: color };
    },
  },
  {
    id: "leaf",
    label: "Leaf",
    emoji: "🍃",
    Component: "path",
    defaultProps: (x, y, color, size, rotation = 0) => {
      const h = size * 0.5;
      const w = size * 0.25;
      const d = `M ${x} ${y - h} C ${x + w} ${y - h * 0.5} ${x + w} ${y + h * 0.2} ${x} ${y + h}
                 C ${x - w} ${y + h * 0.2} ${x - w} ${y - h * 0.5} ${x} ${y - h} Z`;
      return { d, fill: color, transform: `rotate(${rotation} ${x} ${y})` };
    },
  },
  {
    id: "lotus",
    label: "Lotus",
    emoji: "🪷",
    // Built from 6 overlapping petals
    Component: "g",
    isGroup: true,
    defaultProps: (x, y, color, size) => ({ x, y, color, size }),
  },
  {
    id: "triangle",
    label: "Triangle",
    emoji: "▲",
    Component: "polygon",
    defaultProps: (x, y, color, size, rotation = 0) => ({
      points: `${x},${y - size * 0.48} ${x + size * 0.42},${y + size * 0.38} ${x - size * 0.42},${y + size * 0.38}`,
      fill: color,
      transform: `rotate(${rotation} ${x} ${y})`,
    }),
  },
  {
    id: "diya",
    label: "Diya",
    emoji: "🪔",
    Component: "path",
    defaultProps: (x, y, color, size) => {
      // Simplified diya (lamp) outline
      const d = `M ${x - size * 0.4} ${y + size * 0.2}
                 Q ${x - size * 0.4} ${y} ${x} ${y - size * 0.3}
                 Q ${x + size * 0.4} ${y} ${x + size * 0.4} ${y + size * 0.2}
                 Q ${x} ${y + size * 0.5} ${x - size * 0.4} ${y + size * 0.2} Z`;
      return { d, fill: color };
    },
  },
  {
    id: "hexagon",
    label: "Hexagon",
    emoji: "⬡",
    Component: "polygon",
    defaultProps: (x, y, color, size) => {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (i * Math.PI) / 3 - Math.PI / 6;
        return `${x + size * 0.45 * Math.cos(a)},${y + size * 0.45 * Math.sin(a)}`;
      });
      return { points: pts.join(" "), fill: color };
    },
  },
];

export const getShape = (id) => TILE_SHAPES.find(s => s.id === id) || TILE_SHAPES[0];
