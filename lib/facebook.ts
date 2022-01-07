import { logger } from '../config/logger';

let pageContext: FacebookPageContext | null = null;
let pageId: string | null = null;

// https://developers.facebook.com/docs/messenger-platform/reference/messenger-extensions-sdk/getContext
// First param of .getContext is app_id which is different from page_id
// so we never execute the success function
//TODO: REMOVE FUNCTION AND ALL USES
function getUserContextFromFacebook() {
  window.MessengerExtensions.getContext(
    pageId,
    function success(uids) {
      pageContext = uids;
      window.dispatchEvent(new Event('page-context-loaded'));
    },
    function error(err) {
      logger.error('Error getting the user context from Facebook', err);
    }
  );
}

function injectSDK() {
  (function initFacebook(d, s, id) {
    if (d.getElementsByTagName(s)[0]) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      const js = d.createElement(s) as HTMLScriptElement;
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/messenger.Extensions.js';
      fjs.parentNode.insertBefore(js, fjs);
    }
  })(document, 'script', 'Messenger');
}

export default function init() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  pageId = urlParams.get('page_id');
  if (!pageId) {
    logger.warn('Missing required query parameter: page_id');
    return;
  }

  logger.info('Initialize Facebook SDK with pageId:', pageId);

  window.extAsyncInit = getUserContextFromFacebook;
  injectSDK();
}

export function getPageContext(): FacebookPageContext | null {
  return pageContext;
}

export function closeWebview() {
  logger.info('Close webview triggered');
  window.MessengerExtensions.requestCloseBrowser(
    () => {
      logger.info('Webview closed');
    },
    (err) => {
      window.close();
      logger.error(err);
    }
  );
}

export function getSupportedFeatures() {
  logger.info('getting Supported features');
  window.MessengerExtensions.getSupportedFeatures(
    function success(result) {
      const features = result.supported_features;
      logger.info('Supported features: ', features);
    },
    function error(err) {
      logger.info('Error in supported features: ', err);
    }
  );
}
