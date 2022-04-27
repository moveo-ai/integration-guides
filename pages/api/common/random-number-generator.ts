import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { AppError, MethodNotAllowed } from '../../../util/errors';
import { checkHmacSignature } from '../util/helper';

const RANDOM_NUMBER_VERFICIATION_TOKEN = '123456789';

const random = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

/**
 * Returns random number given url params max and min
 * Can be used in Moveo along with conditions for AB testing new functionality
 */
const handler = (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  checkHmacSignature(req, RANDOM_NUMBER_VERFICIATION_TOKEN);

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

export const config = {
  api: {
    bodyParser: false,
  },
};

export default errorHandlerMiddleware(bodyRawParser(handler));
