/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';

axiosRetry(axios, { retryDelay: axiosRetry.exponentialDelay, retries: 3 });

/**
 * Creates an axios instance
 * @returns {AxiosInstance} axios instance
 */
export const createAxiosInstance = (
  config?: AxiosRequestConfig
): AxiosInstance =>
  axios.create({
    validateStatus: function (status) {
      return status >= 200 && status < 400;
    },
    ...config,
  });

export const fetcher = (url: string): Promise<any> =>
  createAxiosInstance()
    .get(url)
    .then((res) => res.data);
