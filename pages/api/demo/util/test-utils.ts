import { NextApiResponse } from 'next';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../../../config/logger';
import { NextApiRequestWithLog } from '../../../../types/moveo';

type MockNextApiRequest = {
    method: 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'HEAD';
    url?: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
    headers?: {
        [key: string]: string;
    };
    cookies?: {
        [key: string]: string;
    };
    query?: {
        [key: string]: string;
    };
};

export const createMockResponse = (): NextApiResponse => {
    const json = jest.fn();
    const setHeader = jest.fn();
    const status = jest.fn(() => ({
        json,
    }));
    return {
        json,
        status,
        setHeader,
    } as unknown as NextApiResponse;
};

export const createMockRequest = (
    params?: MockNextApiRequest
): NextApiRequestWithLog => {
    const headers = {
        'x-vercel-id': uuidv4(),
        'x-real-ip': '127.1.2.3',
        'x-forwarded-for': '127.1.2.3',
        'x-vercel-deployment-url': 'https://webviews-testing.moveo.ai',
        host: 'https://client.com',
    };

    return {
        log: logger,
        id: headers['x-vercel-id'],
        url: params?.url || 'https://webviews.moveo.ai/fake-url',
        method: params?.method || 'POST',
        headers: { ...headers, ...params?.headers },
        body: params?.body || {},
        query: params?.query || {},
        cookies: params?.cookies || {},
    } as unknown as NextApiRequestWithLog;
};

export const createLocationFromUrl = (url: string) =>
    new URL(url) as unknown as Location;
