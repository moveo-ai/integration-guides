import { PaletteMode } from '@mui/material';
import { createContext } from 'react';

export const ColorModeContext = createContext({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setMode: (_theme: PaletteMode): void => {},
  mode: 'light' as PaletteMode,
});
