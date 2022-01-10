module.exports = {
  purge: ['./pages/**/*.tsx', './pages/**/*.js'],
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
