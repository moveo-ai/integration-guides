import createCache from '@emotion/cache';

const isBrowser = typeof document !== 'undefined';

// On the client side, Create a meta tag at the top of the <head> and set it as insertionPoint.
// This assures that MUI styles are loaded first.
// It allows developers to easily override MUI styles with other styling solutions, like CSS modules.
export default function createEmotionCache() {
  let insertionPoint;

  if (isBrowser) {
    const emotionInsertionPoint = document.querySelector(
      'meta[name="emotion-insertion-point"]'
    );
    insertionPoint = emotionInsertionPoint ?? undefined;
  }

  // Must stay 'css' to match what MUI v9 emits during SSR (its styled-engine
  // default). With a custom key, the client renders `<key>-*` classes while the
  // server still emits `css-*`, causing hydration mismatches (verified: 4 → 0).
  // The webviews reference keeps a custom key, but that repo is on MUI v7.
  return createCache({ key: 'css', insertionPoint });
}
