import pino from 'pino';
import purchases from '../mockdata/purchases.json';
import { Purchase } from './models';

export const listPurchases = async (
  logger: pino.Logger,
  user_id: string,
  session_id: string,
  request_id: string,
  moveo_request_id: string,
  isClothes?: boolean
): Promise<Purchase[]> => {
  const url = 'https://dummy-url-that-returns-purchases';
  const data = { CustomerId: user_id };

  // these are some good headers to be passed to your API
  const headers = {
    'User-Agent': `moveo-webhooks-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    'X-Moveo-Session-Id': session_id,
    'X-Moveo-Request-Id': moveo_request_id,
    'X-Request-Id': request_id,
  };

  logger.info({ ...data, ...headers }, `Retrieving purchases from ${url}`);

  if (isClothes) return purchases.clothingPurchases as Purchase[];

  // API results are mocked
  return purchases.techPurchases as Purchase[];
};
