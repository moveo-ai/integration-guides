import { ThemeProvider } from '@material-ui/styles';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SWRConfig } from 'swr';
import '../styles/index.css';
import theme from '../styles/theme';
import { fetcher } from '../util/fetcher';

export async function getInitialProps({ Component, ctx }) {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
}

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Môveo AI | Integration-guides</title>
        <meta
          name="apple-mobile-web-app-title"
          content="Môveo AI | Integration-guides"
        />
        <meta name="application-name" content="Môveo AI | Integration-guides" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <ThemeProvider theme={theme}>
        <SWRConfig value={{ fetcher }}>
          <Component {...pageProps} />
        </SWRConfig>
      </ThemeProvider>
      <style jsx global>{`
        #__next {
          height: 100%;
        }
      `}</style>
    </>
  );
}
