import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

export const ColorModeContext = createContext({
  setMode: (_theme: PaletteMode): void => {},
  mode: 'light' as PaletteMode,
});
