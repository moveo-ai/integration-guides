import {
  Language,
  MoveoChannel,
  WebhookResponse,
} from '../../../../types/moveo';

export type PropertyType =
  | 'apartment'
  | 'detached'
  | 'floor'
  | 'hotel'
  | 'industrial'
  | 'maisonette'
  | 'offices'
  | 'villa'
  | 'block-of-flats'
  | 'retail-leisure'
  | 'land-plot';

export interface SearchParams {
  filters: {
    offering_type: 'selling' | 'letting';
    property_type: PropertyType;
    price: number;
    size: number;
    areas: string[];
  };
  hitsPerPage: 5;
  page: number;
}

export type PropertySearchContext = {
  areas_msg: string;
  area: string;
  property_type_value: PropertyType;
  offering_type_value: string;
  pageNumber: number;
  price: number;
  size: number;
  search_areas: string;
  lang: Language;
  session_id: string;
  channel: MoveoChannel;
  brain_id: string;
  user: { user_id?: string; external_id?: string };
};

export interface PropertySearchResponse extends WebhookResponse {
  output: {
    property_search_code: number;
    property_search_message?: string;
    search_areas?: string;
    pageNumber?: number;
  };
}

export interface SearchResponse<t> {
  hits: t[];
  nbHits: number;
}

export interface PropertySearchResult {
  featuredImage?: string;
  title?: string;
  price?: number;
}
