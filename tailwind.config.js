/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Include your React components
  ],
  theme: {
    extend: {
      keyframes: {
        scrollX: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100% )' },
        },
      },
      animation: {
        scrollX: 'scrollX 20s linear infinite',
        scrollX1: 'scrollX 15s linear infinite',
      },
    },
  },
  plugins: [],
};
