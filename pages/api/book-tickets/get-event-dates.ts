import { t } from 'i18next';
import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
import { i18nInstance } from '../../../util/i18n';
import { checkHmacSignature } from '../util/helper';
import * as API from './util/api';
import { GetEventDatesContext } from './util/models';
import { formatEventDatesResponse, getEventDatesError } from './util/responses';

const GET_EVENT_DATES_TOKEN = '123456789';

/**
 *  Gets the available dates for an event given the event_id
 */
const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  // Validate request
  checkHmacSignature(req, GET_EVENT_DATES_TOKEN);

  // Extract context variables from the request body
  const { lang, session_id, channel, brain_id } = req?.body || {};
  const ctx = req?.body?.context as GetEventDatesContext;
  const { event_id } = ctx;

  const log = req.log.child({ session_id, channel, brain_id, lang });

  // Check for missing parameters
  if (!event_id) {
    const message = `Missing required parameter: event_id`;
    req.log.warn(message);
    return res.json(getEventDatesError(400, message));
  }

  // Load translations
  await i18nInstance(lang);

  try {
    const resp = await API.getDates(
      log,
      event_id,
      session_id,
      req.id,
      req.moveo_id,
      t
    );
    res.json(formatEventDatesResponse(resp, t) as WebhookResponse);
  } catch (error) {
    const message = `Error fetching dates for event: ${event_id}`;
    req.log.error(error, message);
    res.json(getEventDatesError(500, message));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
