import { t } from 'i18next';
import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
import { i18nInstance } from '../../../util/i18n';
import { checkHmacSignature } from '../util/helper';
import * as API from './util/api';
import { GetEventsContext, GetEventsResponse } from './util/models';
import {
  formatEventSearchResponse,
  formatNoMoreEventsResponse,
  getEventsError,
} from './util/responses';

const GET_EVENTS_TOKEN = '123456789';

/**
 *  Gets the available events for a specific category and area
 */
const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<GetEventsResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }
  // Validate request
  checkHmacSignature(req, GET_EVENTS_TOKEN);

  // Extract context variables from the request body
  const { lang, session_id, channel, brain_id } = req?.body || {};
  const ctx = req?.body?.context as GetEventsContext;
  const { event_type_value: event_type, area, page_number } = ctx;

  // Check for missing parameters
  const params: string[] = [];
  if (!event_type) params.push('event_type_value');
  if (!area) params.push('area');
  if (params.length > 0) {
    const message = `Missing required parameters: ${params.join(', ')}`;
    req.log.warn(message);
    return res.json(getEventsError(400, message));
  }

  const log = req.log.child({ session_id, channel, brain_id, lang });

  // Extract page. When page_number is negative we return a text response.
  let page = 0;
  if (page_number) {
    if (page_number < 0) {
      return res.json(formatNoMoreEventsResponse(event_type, area, t));
    }
    page = page_number;
  }

  // Load translations
  await i18nInstance(lang);

  try {
    // Get the data from dummy endpoint
    const resp = await API.getEvents(
      log,
      event_type,
      area,
      page,
      session_id,
      req.id,
      req.moveo_id,
      t
    );
    // Return a carousel using the data
    res.json(formatEventSearchResponse(resp, event_type, area, page, t));
  } catch (error) {
    const message = `Error fetching events with type: ${event_type} and area: ${area}`;
    req.log.error(error, message);
    res.json(getEventsError(500, message));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
