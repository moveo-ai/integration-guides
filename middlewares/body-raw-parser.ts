import { NextApiResponse } from 'next';
import getRawBody from 'raw-body';
import { ApiHandler, NextApiRequestWithLog } from '../types/moveo';

/**
 * Adds the body as buffer in `req.rawBody`
 * @param handler The API handler
 */
const bodyRawParser =
  (handler: ApiHandler) =>
  async (req: NextApiRequestWithLog, res: NextApiResponse) => {
    // Read the body as buffer and store it in rawBody
    req.rawBody = await getRawBody(req, { limit: '10mb' });
    // Parse the body and set it as req.body for future handler
    req.body = JSON.parse(Buffer.from(req.rawBody).toString('utf-8'));

    await handler(req, res);
  };

export default bodyRawParser;
