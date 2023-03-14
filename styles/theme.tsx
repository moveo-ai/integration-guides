import { createTheme, PaletteMode } from '@mui/material';

const palette = {
  dark: {
    primary: {
      main: '#1B66D6',
    },
    secondary: {
      main: '#FFFFFF',
    },
    background: {
      default: '#000000',
    },
    text: {
      primary: '#FFFFFF',
    },
  },
  light: {
    primary: {
      main: '#1b66d6',
    },
    secondary: {
      main: '#FFFFFF',
    },
    error: {
      main: '#FF0000',
    },
    text: {
      secondary: '#8499a8',
    },
  },
};

const theme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: { mode, ...(mode === 'light' ? palette.light : palette.dark) },
    typography: {
      button: {
        textTransform: 'none',
      },
      fontFamily: 'inherit',
    },
    components: {
      MuiSelect: {
        styleOverrides: {
          icon: {
            marginRight: '20px',
          },
        },
      },
      MuiFormHelperText: {
        styleOverrides: {
          root: {
            marginLeft: '14px',
          },
        },
      },
      MuiDialogTitle: {
        styleOverrides: {
          root: {
            display: 'flex',
            justifyContent: 'space-between',
          },
        },
      },
      MuiListItem: {
        styleOverrides: {
          gutters: {
            paddingLeft: '0',
            paddingRight: '0',
          },
        },
      },
    },
  });

export default theme;
