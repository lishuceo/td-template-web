/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'game-bg': '#1A1A1A',
        'game-scene': '#00CED1',
        'game-enemy': '#FF1493',
        'game-elite': '#9B30FF',
        'game-boss': '#FF4500',
        'game-gold': '#FFD700',
        'game-base': '#32CD32',
        'game-danger': '#FF8C00',
        'game-path': '#2F4F4F',
      },
      boxShadow: {
        'long': '8px 8px 0px rgba(0, 0, 0, 0.3)',
        'long-sm': '4px 4px 0px rgba(0, 0, 0, 0.3)',
      },
    },
  },
  plugins: [],
}
