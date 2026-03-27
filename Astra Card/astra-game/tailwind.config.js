/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                astra: {
                    gold: '#FFD700',
                    dark: '#1a1a1a',
                    accent: '#DAA520',
                    card: 'rgba(255, 255, 255, 0.1)',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Cinzel', 'serif'], // Assuming we add a font later
            }
        },
    },
    plugins: [],
}
