/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        parchment: "#F6E8C3",
        sea: {
          deep: "#1E3A8A",
          teal: "#0F766E"
        },
        spice: {
          saffron: "#F59E0B",
          pepper: "#111827",
          cardamom: "#84CC16"
        }
      }
    }
  },
  plugins: []
};

