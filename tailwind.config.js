module.exports = {
  content: ['./pages/**/*.tsx', './pages/**/*.js', './components/**/*.tsx'],
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
  variants: {
    margin: ['last'],
  },
};
