/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F5E6D3",
        path: "#FFD700",
        wall: "#B85450",
        guard: "#FF9933",
        accent: "#4B0082"
      },
      borderRadius: {
        tile: "0.75rem"
      }
    }
  },
  plugins: []
};

