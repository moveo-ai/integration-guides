import { v4 as uuidv4 } from 'uuid';
import {
  Action,
  CarouselCardProps,
  WebhookResponse,
} from '../../../../types/moveo';
import {
  EventSearchResult,
  EventType,
  GetEventDatesResult,
  GetEventsResponse,
} from './models';

const PLACEHOLDER_IMAGE =
  'https://c.pxhere.com/images/4b/85/2686f1f88d3b2229c9bc0d573439-1588581.jpg!d';

const createLastCard = (
  eventType: string,
  area: string,
  t
): CarouselCardProps => {
  return {
    media: {
      url: 'https://freesvg.org/img/go-next.png',
      type: 'image',
    },
    title: t('book-tickets.view_more_title', [eventType]),
    subtitle: t('book-tickets.view_more_subtitle', [eventType, area]),
    buttons: [
      {
        value: t('book-tickets.view_more_button_value', [eventType, area]),
        label: t('book-tickets.view_more_button_label'),
        type: 'postback',
      },
    ],
  };
};

/**
 * Returns a carousel of events using the mock data
 */
export const formatEventSearchResponse = (
  searchResult: EventSearchResult,
  eventType: EventType,
  area: string,
  page: number,
  t
): GetEventsResponse => {
  // No results
  if (searchResult?.nbHits === 0) {
    return {
      output: {
        get_events_code: 204,
        get_events_msg: t('book-tickets.no_results'),
      },
      responses: [
        {
          action_id: uuidv4(),
          type: 'text',
          texts: [t('book-tickets.no_results_text', [eventType, area])],
        },
      ],
    };
  }
  const responses: Action[] = [];
  let pageNumber = page + 1;
  if (page === 0) {
    responses.push({
      action_id: uuidv4(),
      type: 'text',
      texts: [
        t('book-tickets.number_of_events_in_area', [
          searchResult?.nbHits,
          eventType,
          area,
        ]),
      ],
    });
  }
  // Negative page number means no more results
  if (searchResult?.hits?.length < 5) {
    pageNumber = -1;
  }
  const cards = searchResult?.hits?.map((result): CarouselCardProps => {
    const eventTitle = t('book-tickets.event_title', [
      result?.title,
      result?.area,
    ]);
    return {
      media: {
        url: result?.imageUrl || PLACEHOLDER_IMAGE,
        type: 'image',
      },
      title: eventTitle || t('book-tickets.no_title'),
      buttons: [
        {
          value: t('book-tickets.carousel_button_value', [
            eventTitle,
            result?.eventId,
          ]),
          label: t('book-tickets.carousel_button_label'),
          type: 'postback',
        },
      ],
      subtitle: result?.price
        ? t('book-tickets.tickets_cost', [result?.price])
        : t('book-tickets.no_price'),
    };
  });

  if (searchResult.hasMoreResults) {
    cards.push(createLastCard(eventType, area, t));
  }
  responses.push({
    action_id: uuidv4(),
    type: 'carousel',
    cards,
  });
  return {
    responses,
    output: {
      get_events_code: 200,
      get_events_msg: 'ok',
      page_number: pageNumber,
    },
  };
};
export const formatNoMoreEventsResponse = (
  eventType: EventType,
  area: string,
  t
): GetEventsResponse => {
  return {
    output: {
      get_events_code: 200,
      get_events_msg: t('book-tickets.no_more_events'),
    },
    responses: [
      {
        action_id: uuidv4(),
        type: 'text',
        texts: [t('book-tickets.no_more_events_text', [eventType, area])],
      },
    ],
  };
};

export const getEventsError = (
  code: number,
  message: string
): GetEventsResponse => {
  return {
    output: {
      get_events_code: code,
      get_events_msg: message,
    },
  };
};
/**
 *  Returns a text response with the dates
 *  and the price as a context variable
 */
export const formatEventDatesResponse = (result: GetEventDatesResult, t) => {
  const dateOptions = result.dates.map((date) => ({
    text: `1e53a5b1-4164-4149-8145-509baa1a6121 ${date}`,
    label: date,
  }));
  return {
    output: { get_dates_code: 200, get_dates_msg: 'ok', price: result.price },
    responses: [
      {
        action_id: uuidv4(),
        type: 'text',
        texts: [t('book-tickets.select_date')],
        options: dateOptions,
      },
    ],
  };
};

export const getEventDatesError = (
  code: number,
  message: string
): WebhookResponse => {
  return {
    output: {
      get_event_dates_code: code,
      get_event_dates_msg: message,
    },
  };
};

export const calculateTotalCostError = (
  code: number,
  message: string
): WebhookResponse => {
  return {
    output: {
      calculate_total_cost_code: code,
      calculate_total_cost_msg: message,
    },
  };
};
