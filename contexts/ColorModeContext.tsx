import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

export const ColorModeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setMode: (_theme: PaletteMode): void => {},
  mode: 'light' as PaletteMode,
});
