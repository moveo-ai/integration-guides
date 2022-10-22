import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
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
          color: 'var(--color-black)',
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
