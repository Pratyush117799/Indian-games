/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        terracotta: "#CD5C5C",
        board: "#D2691E",
        cream: "#FFFDD0",
        saffron: "#FF9933",
      },
    },
  },
  plugins: [],
};
