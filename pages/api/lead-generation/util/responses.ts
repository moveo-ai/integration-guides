import { v4 as uuidv4 } from 'uuid';
import { Action, CarouselCardProps, Language } from '../../../../types/moveo';
import {
  PropertySearchResponse,
  PropertySearchResult,
  SearchResponse,
} from './models';
export const PLACEHOLDER_IMAGE =
  'https://media.istockphoto.com/vectors/house-flat-icon-vector-illustration-vector-id1072185464?k=20&m=1072185464&s=612x612&w=0&h=CM_SfnMMl-jJ8AFHBa4b_V2LThEt4JIcPQfzUb9rMLM=';

export const formatResponse = (
  searchResults: SearchResponse<PropertySearchResult>,
  page: number,
  areas: string[],
  lang: Language
): PropertySearchResponse => {
  // No results
  if (searchResults?.hits?.length === 0) {
    return {
      output: {
        property_search_code: 1,
        property_search_message: 'No results',
        search_areas: areas.join(', '),
      },
    };
  }
  const responses: Action[] | undefined = [];
  let pageNumber = page;
  if (page === 0) {
    responses.push({
      action_id: uuidv4(),
      type: 'text',
      texts: [`Found ${searchResults.nbHits} matches for these areas ${areas}`],
    });
  }
  if (searchResults?.hits?.length < 5) {
    pageNumber = -1;
  }
  const cards = searchResults?.hits.map((result): CarouselCardProps => {
    return {
      media: {
        url: result?.featuredImage || PLACEHOLDER_IMAGE,
        type: 'image',
      },
      title: `${result?.title}${'sq.m'}` || 'No title',
      buttons: [
        {
          value: `I am interested in ${uuidv4()}`,
          label: 'I am interested',
          type: 'postback',
        },
      ],
      subtitle: result?.price ? `Price: ${result?.price}€` : 'No price',
    };
  });
  responses.push({
    action_id: uuidv4(),
    type: 'carousel',
    cards,
  });
  return {
    responses,
    output: {
      property_search_code: 0,
      property_search_message: 'ok',
      search_areas: areas.join(', '),
      pageNumber: pageNumber + 1,
    },
  };
};

export const formatError = (
  code: number,
  message: string
): PropertySearchResponse => {
  return {
    output: {
      property_search_code: code,
      property_search_message: message,
    },
  };
};
