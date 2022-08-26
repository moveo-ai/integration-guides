import { filter } from 'lodash';
import pino from 'pino';
import { NotFoundError } from '../../../../util/errors';
import { events } from './helper';
import { EventSearchResult, EventType } from './models';

export const getEvents = async (
  logger: pino.Logger,
  event_type: EventType,
  area: string,
  page_number: number,
  session_id: string,
  request_id: string,
  moveo_request_id: string
): Promise<EventSearchResult> => {
  const url = 'https://dummy-url-that-returns-events';

  // these are some good headers to be passed to your API
  const headers = {
    'User-Agent': `moveo-webhooks-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    'X-Moveo-Session-Id': session_id,
    'X-Moveo-Request-Id': moveo_request_id,
    'X-Request-Id': request_id,
  };

  const HITS = filter(events, (e) => e.type === event_type && e.area === area);

  logger.info(
    { ...headers },
    `Retrieving events of type: ${event_type} for area: ${area} from ${url}`
  );

  const currentPage = HITS?.slice(0 + page_number * 5, 5 + page_number * 5);

  // API results are mocked
  return {
    nbHits: HITS?.length,
    hits: currentPage,
    area,
    hasMoreResults: HITS.length > 5 + page_number * 5,
  };
};

export const getDates = async (
  logger: pino.Logger,
  eventId: number,
  session_id: string,
  request_id: string,
  moveo_request_id: string
): Promise<string[]> => {
  const url = 'https://dummy-url-that-returns-dates';

  // these are some good headers to be passed to your API
  const headers = {
    'User-Agent': `moveo-webhooks-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    'X-Moveo-Session-Id': session_id,
    'X-Moveo-Request-Id': moveo_request_id,
    'X-Request-Id': request_id,
  };

  const event = events.find((e) => e.eventId === eventId);

  if (event) {
    logger.info(
      { ...headers },
      `Retrieving dates for event with id: ${eventId} from ${url}`
    );
    return event?.dates;
  }

  logger.warn({ ...headers }, `Could not find event with id: ${eventId}`);
  throw new NotFoundError('eventId', eventId.toString());
};
