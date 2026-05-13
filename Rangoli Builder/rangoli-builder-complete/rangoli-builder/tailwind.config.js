/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        saffron:  { DEFAULT: "#E85D04", light: "#FF8C00", dark: "#C74D00" },
        deepPink: { DEFAULT: "#9B2335", light: "#C42B40" },
        indigo:   { DEFAULT: "#1A237E", light: "#3949AB" },
        teal:     { DEFAULT: "#00695C", light: "#00897B" },
        gold:     { DEFAULT: "#C77B00", light: "#F9A825" },
        cream:    "#FFF8E7",
        rangoli:  { bg: "#0F0A1E", grid: "#1A1035" },
      },
      fontFamily: { display: ["Georgia", "serif"] },
      animation: {
        "tile-pop":   "tilePop 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
      },
      keyframes: {
        tilePop:   { "0%": { transform: "scale(0)" }, "100%": { transform: "scale(1)" } },
        glowPulse: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.6 } },
      },
    },
  },
  plugins: [],
};
