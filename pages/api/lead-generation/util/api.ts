import { capitalize } from 'lodash';
import pino from 'pino';
import { propertiesPerType, random } from './helper';
import { PropertySearchResult, SearchParams, SearchResponse } from './models';
import { PLACEHOLDER_IMAGE } from './responses';

export const getProperties = async (
  logger: pino.Logger,
  search_params: SearchParams,
  user_id: string,
  session_id: string,
  request_id: string,
  moveo_request_id: string
): Promise<SearchResponse<PropertySearchResult>> => {
  const url = 'https://dummy-url-that-returns-properties';
  const data = { CustomerId: user_id };

  // these are some good headers to be passed to your API
  const headers = {
    'User-Agent': `moveo-webhooks-${process.env.VERCEL_GIT_COMMIT_SHA}`,
    'X-Moveo-Session-Id': session_id,
    'X-Moveo-Request-Id': moveo_request_id,
    'X-Request-Id': request_id,
  };
  const {
    property_type,
    areas,
    price: maxPrice,
    size,
    offering_type,
  } = search_params.filters;
  const properties = propertiesPerType(property_type);
  const HITS: PropertySearchResult[] = [];
  const basePrice =
    offering_type === 'selling' ? properties?.buy : properties?.rent;
  if (maxPrice <= basePrice) return { nbHits: 0, hits: [] };

  for (let i = 0; i < 7; i++) {
    const finalPrice = random(basePrice * 0.9, maxPrice);
    const hitSize = random(size, size * 1.4);
    HITS.push({
      featuredImage: PLACEHOLDER_IMAGE,
      title: `${capitalize(property_type)} property in ${
        areas[random(0, areas.length)] ?? areas[0]
      } ${hitSize}`,
      price: finalPrice,
    });
  }

  logger.info({ ...data, ...headers }, `Retrieving properties from ${url}`);

  // API results are mocked
  return {
    nbHits: 7,
    hits: search_params?.page === 0 ? HITS?.slice(0, 5) : HITS?.slice(5),
  };
};
