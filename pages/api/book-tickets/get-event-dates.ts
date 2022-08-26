import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
import { checkHmacSignature } from '../util/helper';
import * as API from './util/api';
import { GetEventDates } from './util/models';
import { formatEventDatesResponse, getDatesError } from './util/responses';

const PROPERTY_SEARCH_TOKEN = '123456789';

const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  checkHmacSignature(req, PROPERTY_SEARCH_TOKEN);

  const ctx = req?.body?.context as GetEventDates;
  const { event_id, lang, session_id, channel, brain_id } = ctx;

  if (!event_id) {
    const message = `Missing required parameter: event_id`;
    req.log.warn(message);
    return res.json(getDatesError(400, message));
  }

  const log = req.log.child({ session_id, channel, brain_id, lang });

  try {
    const resp = await API.getDates(
      log,
      event_id,
      session_id,
      req.id,
      req.moveo_id
    );
    res.json(formatEventDatesResponse(resp, lang) as WebhookResponse);
  } catch (error) {
    const message = `Error fetching dates for event: ${event_id}`;
    req.log.error(error, message);
    res.json(getDatesError(500, message));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
