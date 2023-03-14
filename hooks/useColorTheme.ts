import { PaletteMode, useMediaQuery } from '@mui/material';
import { useContext, useEffect } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';

/**
 * If theme is not provided, it will use the user's system preference
 */
const useColorTheme = (theme?: PaletteMode) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const { setMode, mode } = useContext(ColorModeContext);

  useEffect(() => {
    if (!theme) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    } else {
      setMode(theme);
    }
  }, [theme, prefersDarkMode, setMode]);
  return mode;
};

export default useColorTheme;
