import { NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { AppError, MethodNotAllowed } from '../../../util/errors';
import { checkHmacSignature } from '../util/helper';
import * as API from './util/api';
import { purchaseCardsFromAPI } from './util/purchases';

const RECENT_PURCHASES_VERFICIATION_TOKEN = '123456789';

export function successResponse(cards, newCursor: string): WebhookResponse {
  if (cards) {
    return {
      responses: [{ action_id: uuidv4(), type: 'carousel', cards }],
      output: { deposit_cursor: newCursor },
    };
  }
  return { responses: [], output: {} };
}

/**
 *  Gets all recent deposits for a given customer id
 */
const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  const { session_id, channel, brain_id, context, lang } = req.body || {};
  const log = req.log.child({ session_id, channel, brain_id, lang });

  checkHmacSignature(req, RECENT_PURCHASES_VERFICIATION_TOKEN);

  const user = context?.user;
  // external_id will always be populated for verified (authenticated) users
  const user_id = user?.external_id || user?.user_id;

  /*
    Optionally enable authentication.
    Return context variables that can be leveraged in the dialog to inform the end-user accordingly
  */

  //   if (!user?.verified) {
  //     const message = `User ${user_id} is not logged in`;
  //     log.warn(message);
  //     return res.json({
  //         responses: [],
  //         output: { api_unauthorized: true, unauth_descr: message },
  //     })
  //   }

  try {
    const purcheses = await API.listPurchases(
      log,
      user_id,
      session_id,
      req.id,
      req.moveo_id
    );

    if (!purcheses || purcheses.length === 0) {
      const message = `Customer with id: ${user_id} has no purcheses"`;
      log.info(message);
      return res.json({
        responses: [],
        output: { api_no_purchases: true, no_purchases_descr: message },
      });
    }

    const { cards, cursor: newCursor } = purchaseCardsFromAPI(
      log,
      purcheses,
      lang,
      context?.deposit_cursor
    );

    if (cards.length === 0) {
      const message = `Customer with id ${user_id} has no further purcheses to be displayed`;
      log.info(message);
      return res.json({
        responses: [],
        output: { api_no_purchases: true, no_purchases_descr: message },
      });
    }
    return res.json(successResponse(cards, newCursor));
  } catch (error: any) {
    if (!error.response) {
      throw AppError.fromError(log, error);
    }

    const errorPayload = {
      user_id,
      code: error.response.status,
      data: error.response.data,
    };

    log.warn(errorPayload, 'Failed to get pruchases');
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx

    return res.json({
      responses: [],
      output: {
        purchases_get_recent_error: true,
        purchases_error_descr: error.response.data?.ErrorString,
        purchases_error_code: error.response.data?.ErrorCode,
      },
    });
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
