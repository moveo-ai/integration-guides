import { logger } from '../config/logger';

function injectSDK() {
  (function initSunco(d, s, id) {
    if (d.getElementsByTagName(s)[0]) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://cdn.smooch.io/webview-sdk.min.js';
      fjs?.parentNode?.insertBefore(js, fjs);
    }
  })(document, 'script', 'WebviewSdkScript');
}

export default function init() {
  logger.info('Initialize Sunco SDK');

  injectSDK();
}

export function closeWebview() {
  logger.info('Close webview triggered');
  window?.WebviewSdk?.close(
    () => {
      logger.info('Webview closed');
    },
    (err) => {
      window.close();
      logger.error(err);
    }
  );
}
