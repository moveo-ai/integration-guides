import { useCallback, useEffect, useState } from 'react';
import { logger } from '../config/logger';
import initFacebookSDK, {
  closeWebview as closeFacebookWebview,
  getPageContext as getFacebookPageContext,
  getSupportedFeatures as getFacebookFeatures,
} from '../lib/facebook';
import { getContextFromMoveo, sendContextToMoveo } from '../lib/moveo';
import {
  MoveoChannel,
  MoveoContext,
  MoveoContextWithPageInfo,
} from '../types/moveo';

const useWebview = (customer: 'demo') => {
  const [channel, setChannel] = useState<MoveoChannel | null>(null);
  const [missingParameters, setMissingParameters] = useState<string | null>(
    null
  );
  const [integrationId, setIntegrationId] = useState(null);
  const [userId, setUserId] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [triggerNodeId, setTriggerNodeId] = useState(null);
  const [customerId, setCustomerId] = useState<string>(customer);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
    const urlParams = new URLSearchParams(window.location.search);
    setChannel(urlParams.get('channel') as MoveoChannel);
    setIntegrationId(urlParams.get('integration_id'));
    setUserId(urlParams.get('user_id'));
    setSessionId(urlParams.get('session_id'));
    setTriggerNodeId(urlParams.get('trigger_node_id'));

    // For facebook page_id is the customerId. Each facebook page is a customer
    const pageId = urlParams.get('page_id');
    if (pageId && pageId !== customerId) {
      setCustomerId(pageId);
    }
    setIsLoading(false);
  }, [customerId]);

  // initialize the Facebook SDK only when the channel is FB.
  useEffect(() => {
    if (channel === 'facebook') {
      initFacebookSDK();
    }
  }, [channel]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      setMissingParameters(null);
      return;
    }

    if (channel && integrationId && userId && sessionId) {
      setMissingParameters(null);
      return;
    }

    const params = [];
    if (!channel) {
      params.push('channel');
    }
    if (!integrationId) {
      params.push('integration_id');
    }
    if (!userId) {
      params.push('user_id');
    }
    if (!sessionId) {
      params.push('session_id');
    }
    setMissingParameters(`Missing required parameters: ${params.join(', ')}`);
  }, [channel, integrationId, sessionId, userId]);

  useEffect(() => {
    if (missingParameters) {
      logger.warn(missingParameters);
    }
  }, [missingParameters]);

  /**
   * For Facebook, try to get the Page Context from the Facebook SDK. If not possible,
   * we create the Page Context, which contains the sender_id (psid).
   * For Viber, return an empty object as all the necessary info is from the URL params.
   */
  const getPageContext = (): FacebookPageContext | null => {
    if (channel === 'facebook') {
      const fbContext = getFacebookPageContext();
      if (fbContext == null) {
        return { psid: userId };
      }
      return fbContext;
    }
    return null;
  };

  /**
   * For Facebook, call the SDK to close the webview. For Viber treat it as in the Web
   */
  const closeWebview = () => {
    if (channel === 'facebook') {
      return closeFacebookWebview();
    }
    return window.close();
  };

  const getSupportedFeatures = () => {
    if (channel === 'facebook') {
      return getFacebookFeatures();
    }
    return null;
  };

  /**
   * makes a POST request to Integrations that has a 'body' depending on the channel
   * @param {Object} context: the context we want to send to Moveo
   * @param {string} customerId: used to get the Viber/Facebook access token, which is
   *                             stored in an Env. Var.
   *                             For Viber the customerId is hardcoded (e.g 'pisti') but
   *                             for Facebook the customerId is gotten from the urlParams
   *                             and it corresponds to the page_id of the FB page.
   */
  const sendContext = async (context: MoveoContext) => {
    const pageContext = getPageContext();

    const fullContext: MoveoContextWithPageInfo = {
      context,
      trigger_node_id: triggerNodeId,
      user_id: userId,
      page: pageContext,
    };

    if (channel === 'facebook' && !pageContext) {
      throw new Error('Missing required parameters for Facebook: pageContext');
    }

    if (missingParameters) {
      throw new Error(missingParameters);
    }

    const response = await sendContextToMoveo(
      fullContext,
      channel,
      integrationId,
      sessionId,
      customerId
    );

    return response.data;
  };

  const getContext = useCallback(async (): Promise<MoveoContext> => {
    const response = await getContextFromMoveo(
      integrationId,
      channel,
      customerId,
      sessionId,
      userId
    );

    return response.data;
  }, [channel, customerId, integrationId, sessionId, userId]);

  return {
    closeWebview,
    sendContext,
    getContext,
    getSupportedFeatures,
    missingParameters,
    isLoading,
  };
};

export default useWebview;
