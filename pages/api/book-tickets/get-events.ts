import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
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

  checkHmacSignature(req, GET_EVENTS_TOKEN);

  const ctx = req?.body?.context as GetEventsContext;
  const {
    event_type_value: event_type,
    area,
    page_number,
    lang,
    session_id,
    channel,
    brain_id,
  } = ctx;

  const params: string[] = [];
  if (!event_type) params.push('event_type_value');
  if (!area) params.push('area');
  if (params.length > 0) {
    const message = `Missing required parameters: ${params.join(', ')}`;
    req.log.warn(message);
    return res.json(getEventsError(400, message));
  }

  const log = req.log.child({ session_id, channel, brain_id, lang });

  // Pages are used for subsequent searches
  let page = 0;
  if (page_number) {
    if (page_number < 0) {
      return res.json(formatNoMoreEventsResponse(event_type, area));
    }
    page = page_number;
  }

  try {
    const resp = await API.getEvents(
      log,
      event_type,
      area,
      page,
      session_id,
      req.id,
      req.moveo_id
    );
    res.json(formatEventSearchResponse(resp, event_type, area, page, lang));
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
