import {
  Language,
  MoveoChannel,
  WebhookResponse,
} from '../../../../types/moveo';

export type EventType =
  | 'Concerts'
  | 'Festivals'
  | 'Theatrical performances'
  | 'Musical shows'
  | 'Dance performances'
  | 'Cartoons'
  | 'Movies';

export interface SearchParams {
  filters: {
    type: EventType;
  };
  hitsPerPage: 5;
  page: number;
}

export interface EventsSearchResponse extends WebhookResponse {
  output: {
    event_search_code: number;
    event_search_message?: string;
    pageNumber?: number;
  };
}

export type EventSearchResult = {
  nbHits: number;
  hits: Event[];
  area: string;
  hasMoreResults: boolean;
};

export interface Event {
  eventId: number;
  imageUrl: string;
  area: string;
  type: string;
  price: number;
  title: string;
  dates: string[];
}

export type GetEventsContext = {
  event_type_value: EventType;
  area: string;
  page_number?: number;
  lang: Language;
  session_id: string;
  channel: MoveoChannel;
  brain_id: string;
};

export interface GetEventsResponse extends WebhookResponse {
  output: {
    get_events_code: number;
    get_events_msg?: string;
    page_number?: number;
  };
}

export type GetEventDatesContext = {
  event_id: number;
};

export type GetEventDatesResult = { dates: string[]; price: number };

export type CalculateTotalCostContext = {
  tickets_amount: number;
  price: number;
};
