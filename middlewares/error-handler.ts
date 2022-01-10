import { NextApiHandler, NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../config/logger';
import { NextApiRequestWithLog } from '../types/moveo';
import { AppError } from '../util/errors';
import { cleanNullOrUndefined } from '../util/util';

const errorHandlerMiddleware =
  (handler: NextApiHandler) =>
    async (req: NextApiRequestWithLog, res: NextApiResponse) => {
      const params = cleanNullOrUndefined({
        moveo_request_id:
          req?.headers['x-moveo-request-id'] || req?.headers['x-vercel-id'],
        request_id: req?.headers['x-request-id'] || uuidv4(),
        client_ip: req?.headers['x-real-ip'],
        deployment_url: req?.headers['x-vercel-deployment-url'],
        host: req?.headers['host'],
      });
      // Add logging and request id to the main request
      req.moveo_id = params.moveo_request_id;
      req.id = params.request_id;
      req.log = logger.child(params);

      try {
        await handler(req, res);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (_error: any) {
        const error = AppError.fromError(req.log, _error);
        res.status(error.code).json({ error: error.message, code: error.code });
      }
    };

export default errorHandlerMiddleware;
