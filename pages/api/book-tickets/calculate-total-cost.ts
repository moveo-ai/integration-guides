import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
import { checkHmacSignature } from '../util/helper';
import { CalculateTotalCostContext } from './util/models';
import { calculateTotalCostError } from './util/responses';

const CALCULATE_TOTAL_COST_TOKEN = '123456789';

/**
 *  Calculates the total cost for a booking
 */
const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  // Validate request
  checkHmacSignature(req, CALCULATE_TOTAL_COST_TOKEN);

  // Extract context variables from the request body
  const { lang, session_id, channel, brain_id } = req?.body || {};
  const ctx = req?.body?.context as CalculateTotalCostContext;
  const { price, tickets_amount } = ctx;

  const log = req.log.child({ session_id, channel, brain_id, lang });

  // Check for missing parameters
  if (!tickets_amount || !price) {
    const message = `Missing one of required parameters: tickets_amount, price`;
    log.warn(message);
    return res.json(calculateTotalCostError(400, message));
  }

  // Return the total_cost in the context
  const resp = {
    responses: [],
    output: {
      total_cost: tickets_amount * price,
    },
  } as WebhookResponse;

  return res.json(resp);
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
