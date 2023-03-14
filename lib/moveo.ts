import { AxiosResponse } from 'axios';
import { logger } from '../config/logger';
import {
  MoveoChannel,
  MoveoContext,
  MoveoContextWithPageInfo,
  SurveyData,
} from '../types/moveo';
import { AppError } from '../util/errors';
import { createAxiosInstance } from '../util/fetcher';

export const getIntegrationUrl = (host = 'localhost') => {
  let url = 'https://channels.dev.moveo.ai';

  if (!host.includes('.dev.') && !host.includes('localhost')) {
    url = url.replace('.dev.', '.');
  }
  return url;
};

/**
 * Calls the endpoint which signs the Request and returns it
 * @param {string} customer_id The page_id for facebook or just customer id
 * @param {string} sender_id The sender or user id
 * @param {MoveoChannel} channel The channel
 */
export const signRequest = async (
  customer_id: string,
  sender_id: string,
  channel: MoveoChannel
): Promise<string> => {
  const axios = createAxiosInstance();
  const response = await axios.get<{ token: string }>(
    '/api/auth/sign-request',
    {
      params: { customer_id, sender_id, channel },
      timeout: 5000,
    }
  );

  return response.data.token;
};

/**
 * Sends the context, page info, trigger id, etc.. to Moveo
 */
export const sendContextToMoveo = async (
  data: MoveoContextWithPageInfo,
  channel: MoveoChannel,
  integrationId: string,
  sessionId: string,
  customerId: string
): Promise<AxiosResponse> => {
  try {
    const url = getIntegrationUrl(location.host);
    const signature = await signRequest(customerId, data.user_id, channel);

    const axios = createAxiosInstance();
    const response = await axios.post(
      `${url}/v1/${channel}/${integrationId}/webview`,
      data,
      {
        headers: {
          Authorization: `Bearer ${signature}`,
          'X-Moveo-Session-Id': sessionId,
        },
      }
    );
    return response;
  } catch (error) {
    throw AppError.fromError(logger, error);
  }
};

/**
 * Returns the context of a conversation from Moveo
 */
export const getContextFromMoveo = async (
  integrationId: string,
  channel: MoveoChannel,
  customerId: string,
  sessionId: string,
  userId: string
): Promise<AxiosResponse<MoveoContext>> => {
  try {
    const url = getIntegrationUrl(location.host);
    const signature = await signRequest(customerId, userId, channel);

    const axios = createAxiosInstance();
    const response = await axios.get<MoveoContext>(
      `${url}/v1/context/${integrationId}`,
      {
        params: { channel },
        headers: {
          Authorization: `Bearer ${signature}`,
          'X-Moveo-Session-Id': sessionId,
        },
      }
    );
    return response;
  } catch (error) {
    throw AppError.fromError(logger, error);
  }
};
/**
 * Sends the rating and feedback to Analytics
 */
export const sendSurveyToMoveo = async (
  data: { survey: SurveyData; user_id: string | undefined },
  channel: MoveoChannel,
  integrationId: string,
  sessionId: string,
  customerId: string
): Promise<AxiosResponse> => {
  try {
    const url = getIntegrationUrl(location.host);
    const signature = await signRequest(
      customerId,
      data.user_id || '',
      channel
    );

    const axios = createAxiosInstance();
    const response = await axios.post(
      `${url}/v1/survey/${integrationId}`,
      { ...data.survey, session_id: sessionId, timestamp: Date.now() },
      {
        headers: {
          Authorization: `Bearer ${signature}`,
          'X-Moveo-Session-Id': sessionId,
        },
      }
    );
    return response;
  } catch (error) {
    throw AppError.fromError(logger, error as Error);
  }
};
