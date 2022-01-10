/* eslint-disable @typescript-eslint/no-explicit-any */

interface FacebookPageContext {
  thread_type?: 'USER_TO_PAGE' | 'USER_TO_USER' | 'GROUP';
  tid?: string;
  psid: string;
  signed_request?: string;
}

interface Window {
  google: {
    maps: any;
  };

  /**
   * Facebook Messenger extensions.
   * Documentation: https://developers.facebook.com/docs/messenger-platform/webview/extensions/
   */
  MessengerExtensions: {
    getContext: (
      appId: string,
      success: (context: FacebookPageContext) => void,
      error: (error: Error) => void
    ) => void;
    requestCloseBrowser: (
      success: () => void,
      error: (error: Error) => void
    ) => void;
    getSupportedFeatures: (
      success: (features: { supported_features: string[] }) => void,
      error: (error: Error) => void
    ) => void;
  };

  extAsyncInit: () => void;
}
