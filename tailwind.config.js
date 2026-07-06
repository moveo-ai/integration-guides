/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      margin: {
        96: '24rem',
        128: '32rem',
      },
      colors: {
        pisti: '#2A4C72',
      },
    },
  },
  corePlugins: {
    outline: false,
  },
  plugins: [],
};
