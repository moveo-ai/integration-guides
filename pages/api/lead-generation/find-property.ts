import { NextApiResponse } from 'next';
import bodyRawParser from '../../../middlewares/body-raw-parser';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog } from '../../../types/moveo';
import { MethodNotAllowed } from '../../../util/errors';
import { checkHmacSignature } from '../util/helper';
import * as API from './util/api';
import {
  PropertySearchContext,
  PropertySearchResponse,
  SearchParams,
} from './util/models';
import { formatError, formatResponse } from './util/responses';

const PROPERTY_SEARCH_TOKEN = '123456789';

const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<PropertySearchResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  checkHmacSignature(req, PROPERTY_SEARCH_TOKEN);

  const ctx = req?.body?.context as PropertySearchContext;
  const {
    areas_msg,
    area,
    property_type_value,
    offering_type_value,
    pageNumber,
    price,
    size,
    search_areas,
    lang,
    session_id,
    channel,
    brain_id,
    user,
  } = ctx;

  const log = req.log.child({ session_id, channel, brain_id, lang });
  const user_id = user?.external_id || user?.user_id;
  const entities = req?.body?.entities;
  const message = req?.body?.input?.text;

  const params: string[] = [];
  if (!areas_msg && !area) params.push('area');
  if (!property_type_value) params.push('property_type_value');
  if (!offering_type_value) params.push('offering_type_value');
  if (!price) params.push('price');
  if (!size) params.push('size');
  if (params.length > 0) {
    const message = `Missing required parameters: ${params.join(', ')}`;
    req.log.warn(message);
    return res.json(formatError(2, message));
  }

  //Extract search areas
  const areasFilters: Array<string> = [];
  const areasArr: Array<string> = [];
  //When we search for more results
  if (search_areas) {
    search_areas.split(', ').map((areaName: string) => {
      areasArr.push(areaName);
      areasFilters.push(`area.name.el:${areaName} OR area.name.en:${areaName}`);
    });
    //When we search for a single area
  } else if (area) {
    areasArr.push(`"${area}"`);
    //When there are multiple area entities matched
  } else if (
    entities &&
    entities.length > 0 &&
    entities.find((entity) => entity.entity === 'area')
  ) {
    entities.map((entity: { entity: string; start: number; end: number }) => {
      if (entity.entity === 'area') {
        if (!message) {
          const message = `Input text is undefined in the request body`;
          req.log.error(message);
          return res.json(formatError(5, message));
        }
        const areaName = message.substring(entity?.start, entity?.end);
        areasArr.push(`"${areaName}"`);
        areasFilters.push(
          `area.name.el:"${areaName}" OR area.name.en:"${areaName}"`
        );
      }
    });
  } else {
    //We get here only when there are no entities matched on the msg
    const message = `No area entity matches`;
    req.log.warn(message);
    return res.json(formatError(5, message));
  }

  // Create the search limits for price and size
  const highPrice = price * 1.15;
  const lowSize = size * 0.85;

  // Pages are used for subsequent searches
  let page = 0;
  if (pageNumber) {
    page = pageNumber as number;
  }

  // offering type is used to differentiate tenants from buyers
  let offeringType;
  if (offering_type_value === 'buy') {
    offeringType = 'selling';
  } else if (offering_type_value === 'rent') {
    offeringType = 'letting';
  } else {
    const message = `Found offering type ${offering_type_value} but expected one of 'buy', 'rent'`;
    req.log.warn(message);
    return res.json(formatError(3, message));
  }

  const searchParams: SearchParams = {
    filters: {
      offering_type: offeringType,
      property_type: property_type_value,
      price: highPrice,
      size: lowSize,
      areas: areasArr,
    },
    hitsPerPage: 5,
    page,
  };
  try {
    const resp = await API.getProperties(
      log,
      searchParams,
      user_id,
      session_id,
      req.id,
      req.moveo_id
    );
    res.json(formatResponse(resp, page, areasArr));
  } catch (error) {
    const message = 'Error fetching properties';
    req.log.error(error, message);
    res.json(formatError(4, message));
  }
};

export const config = {
  api: {
    bodyParser: false,
  },
};
export default errorHandlerMiddleware(bodyRawParser(handler));
