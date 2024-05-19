import { NextApiResponse } from 'next';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';
import { AppError, MethodNotAllowed } from '../../../util/errors';
import { createAxiosInstance } from '../../../util/fetcher';

export interface JokeResponse {
  error: boolean;
  setup: string;
  delivery: string;
  id: number;
  safe: boolean;
  lang: string;
}

const handler = async (
  req: NextApiRequestWithLog,
  res: NextApiResponse<WebhookResponse>
) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  const client = createAxiosInstance({
    baseURL: 'https://v2.jokeapi.dev/joke',
  });

  const { data } = await client.get<JokeResponse>('/Any');

  if (data?.error) {
    throw new AppError('Error getting joke', 500);
  }

  const resp = { responses: [], output: { joke: data as never } };

  return res.json(resp);
};

export default errorHandlerMiddleware(handler);
