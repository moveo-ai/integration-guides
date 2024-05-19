import { LRUCache } from 'lru-cache';
import { NextApiResponse } from 'next';
import { NextApiRequestWithLog } from '../types/moveo';
import { RateLimitationError } from '../util/errors';

interface Props {
  uniqueTokenPerInterval: number;
  interval: number;
  limit: number;
}
const rateLimit = (options: Props) => {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 90000,
  });

  return {
    check: (req: NextApiRequestWithLog, res: NextApiResponse) => {
      const token = req.headers['x-forwarded-for'] as string;
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;
      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage >= options.limit;
      res.setHeader('X-RateLimit-Limit', `${options.limit}`);
      res.setHeader('X-RateLimit-Remaining', `${options.limit - currentUsage}`);

      if (isRateLimited) {
        throw new RateLimitationError();
      }
    },
  };
};

export default rateLimit;
