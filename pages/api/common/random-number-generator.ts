import { NextApiResponse } from 'next';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { AppError, MethodNotAllowed } from '../../../util/errors';
import { random } from '../../../util/util';

/**
 * Returns random number given url params max and min
 * Can be used in Moveo for AB testing (know whether to trigger handover or not)
 */
const handler = (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  const max = (req.query.max as string) || '1';
  const min = (req.query.min as string) || '0';

  if (parseInt(max) <= parseInt(min)) {
    throw new AppError('max is less or equal to min', 400);
  }

  const randomNumber = random(parseInt(min), parseInt(max));

  const resp = {
    responses: [],
    output: {
      random_number: parseFloat(randomNumber.toFixed(2)),
    },
  };

  return res.json(resp);
};

export default errorHandlerMiddleware(handler);
