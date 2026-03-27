// Ports and spice prices for the Spice Route game
// Buy price = what you pay at this port; sell price = what you get (usually higher elsewhere)

export type Risk = "low" | "medium" | "high";

export interface Port {
  id: string;
  name: string;
  region: string;
  x: number; // 0-100 relative to map
  y: number;
  spices: string[];
  risk: Risk;
  // Price to BUY one unit at this port (gold)
  buyPrices: Record<string, number>;
  // Price you GET when selling one unit here (gold)
  sellPrices: Record<string, number>;
}

export const PORTS: Port[] = [
  {
    id: "muziris",
    name: "Muziris",
    region: "Kerala",
    x: 20,
    y: 68,
    spices: ["Pepper", "Cardamom"],
    risk: "medium",
    buyPrices: { Pepper: 8, Cardamom: 12 },
    sellPrices: { Pepper: 6, Cardamom: 10 },
  },
  {
    id: "calicut",
    name: "Calicut",
    region: "Kerala",
    x: 24,
    y: 65,
    spices: ["Pepper", "Cardamom"],
    risk: "low",
    buyPrices: { Pepper: 10, Cardamom: 14 },
    sellPrices: { Pepper: 8, Cardamom: 12 },
  },
  {
    id: "aden",
    name: "Aden",
    region: "Arabia",
    x: 48,
    y: 58,
    spices: ["Pepper", "Cardamom"],
    risk: "medium",
    buyPrices: { Pepper: 18, Cardamom: 24 },
    sellPrices: { Pepper: 14, Cardamom: 20 },
  },
  {
    id: "alexandria",
    name: "Alexandria",
    region: "Egypt",
    x: 58,
    y: 42,
    spices: ["Pepper", "Cardamom"],
    risk: "low",
    buyPrices: { Pepper: 28, Cardamom: 36 },
    sellPrices: { Pepper: 22, Cardamom: 30 },
  },
  {
    id: "rome",
    name: "Rome",
    region: "Mediterranean",
    x: 72,
    y: 28,
    spices: ["Pepper", "Cardamom"],
    risk: "high",
    buyPrices: { Pepper: 42, Cardamom: 52 },
    sellPrices: { Pepper: 35, Cardamom: 44 },
  },
];

export const SPICE_TYPES = ["Pepper", "Cardamom"] as const;
export const STARTING_GOLD = 100;
export const CARGO_CAPACITY = 20;
export const GOAL_GOLD = 300;
