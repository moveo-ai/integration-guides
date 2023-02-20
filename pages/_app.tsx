import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { appWithI18Next } from 'ni18n';
import { SWRConfig } from 'swr';
import createEmotionCache from '../config/css-cache';
import { fetcher } from '../util/fetcher';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { PaletteMode } from '@mui/material';
import ErrorBoundary from '../components/ErrorBoundary';
import { ni18nConfig } from '../ni18n.config';
import createTheme from '../styles/theme';

import { useMemo, useState } from 'react';
import { ColorModeContext } from '../contexts/ColorModeContext';
import '../styles/index.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const MyApp = (props: MyAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [mode, setMode] = useState<PaletteMode>('light');

  // Update the theme only if the mode changes
  const theme = useMemo(() => createTheme(mode), [mode]);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Môveo AI | Integration-guides</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <meta
          name="apple-mobile-web-app-title"
          content="Môveo AI | Integration-guides"
        />
        <meta name="application-name" content="Môveo AI | Integration-guides" />
        <meta name="msapplication-TileColor" content="#2b5797" />
      </Head>
      <ColorModeContext.Provider value={{ setMode, mode }}>
        <ThemeProvider theme={theme}>
          <SWRConfig value={{ fetcher }}>
            {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
            <CssBaseline />
            <ErrorBoundary>
              <Component {...pageProps} />
            </ErrorBoundary>
          </SWRConfig>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </CacheProvider>
  );
};

export default appWithI18Next(MyApp, ni18nConfig);
