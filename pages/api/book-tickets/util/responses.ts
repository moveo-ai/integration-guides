import { v4 as uuidv4 } from 'uuid';
import {
  Action,
  CarouselCardProps,
  Language,
  WebhookResponse,
} from '../../../../types/moveo';
import { EventSearchResult, EventType, GetEventsResponse } from './models';
const PLACEHOLDER_IMAGE =
  'https://c.pxhere.com/images/4b/85/2686f1f88d3b2229c9bc0d573439-1588581.jpg!d';

const createLastCard = (eventType: string, area: string): CarouselCardProps => {
  return {
    media: {
      url: 'https://freesvg.org/img/go-next.png',
      type: 'image',
    },
    title: `Would you like to view more ${eventType}?`,
    subtitle: `To see more ${eventType} in ${area}, please press below`,
    buttons: [
      {
        value: `I want to see more ${eventType} in ${area}`,
        label: 'View more',
        type: 'postback',
      },
    ],
  };
};

export const formatEventSearchResponse = (
  searchResult: EventSearchResult,
  eventType: EventType,
  area: string,
  page: number,
  lang: Language
): GetEventsResponse => {
  // No results
  if (searchResult?.nbHits === 0) {
    return {
      output: {
        get_events_code: 204,
        get_events_msg: 'No results',
      },
      responses: [
        {
          action_id: uuidv4(),
          type: 'text',
          texts: [
            `There are no ${eventType} available in ${area} for the next month`,
          ],
        },
      ],
    };
  }
  const responses: Action[] = [];
  let pageNumber = page;
  if (page === 0) {
    responses.push({
      action_id: uuidv4(),
      type: 'text',
      texts: [
        `There are ${searchResult.nbHits} ${eventType} available in ${area}`,
      ],
    });
  }
  if (searchResult?.hits.length < 5) {
    pageNumber = -1;
  }
  const cards = searchResult?.hits?.map((result): CarouselCardProps => {
    const eventTitle = `${result?.title} in ${result.area}`;
    return {
      media: {
        url: result?.imageUrl || PLACEHOLDER_IMAGE,
        type: 'image',
      },
      title: eventTitle || 'No title',
      buttons: [
        {
          value: `9c52ec9e-65fc-495f-9ce5-cdb57f6f971b "${eventTitle}" ${result.eventId}`,
          label: 'Book tickets',
          type: 'postback',
        },
      ],
      subtitle: result?.price ? `Tickets cost ${result?.price}€` : 'No price',
    };
  });

  if (searchResult.hasMoreResults) {
    cards.push(createLastCard(eventType, area));
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
      page_number: pageNumber + 1,
    },
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

export const formatEventDatesResponse = (dates: string[], lang: Language) => {
  const dateOptions = dates.map((date) => ({
    text: `1e53a5b1-4164-4149-8145-509baa1a6121 ${date}`,
    label: date,
  }));
  return {
    output: { get_dates_code: 200, get_dates_msg: 'ok' },
    responses: [
      {
        action_id: uuidv4(),
        type: 'text',
        texts: ['Please select one of the available dates for the event'],
        options: dateOptions,
      },
    ],
  };
};

export const getDatesError = (
  code: number,
  message: string
): WebhookResponse => {
  return {
    output: {
      get_dates_code: code,
      get_dates_msg: message,
    },
  };
};
