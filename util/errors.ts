/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosError } from 'axios';
import { Logger } from 'pino';
import { string } from 'prop-types';

export class AppError extends Error {
  code = 500;

  static fromError(logger: Logger, innerError: Error): AppError {
    if (innerError instanceof AppError) {
      return innerError as AppError;
    }

    // Axios errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = innerError as any;
    if (axiosError.response) {
      const { response } = axiosError as AxiosError<any>;

      const error_message = String(
        response?.data?.error ||
          response?.data?.error_message ||
          response?.data ||
          response?.statusText
      );

      const error_code = response?.data?.code || response?.status;

      logger.error(
        {
          headers: response?.headers,
          status: response?.status,
          error_message,
          error_code,
        },
        `HTTP error: ${error_message}`
      );

      const error = new AppError(error_message, error_code);
      error.stack = axiosError.stack;
      return error;
    } else if (axiosError.request) {
      const { request } = axiosError as AxiosError<any>;

      // The request was made but no response was received
      // `error.request` is an instance in http.ClientRequest
      logger.error(request, 'HTTP error without response');
      const error = new AppError('HTTP error without response', 503); // Service Unavailable
      error.stack = axiosError.stack;
      return error;
    }

    const error = new AppError(
      axiosError.message,
      axiosError.statusCode || 500
    );
    error.stack = innerError.stack;
    return error;
  }

  constructor(message: string, code: number) {
    super(message);
    this.name = 'AppError';
    this.code = code;
  }
}

/**
 * Returns a 404 error because the given value does not exist.
 *
 * @param {String} entity The source of the error
 * @param {String} value The value used to query the entity
 */
export class NotFoundError extends AppError {
  constructor(entity: string, value?: string) {
    super(`${entity}${value ? `(${value})` : ''} not found`, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Returns a 429 error because the user is sending too many requests.
 *
 */
export class RateLimitationError extends AppError {
  constructor() {
    super('Too Many Requests', 429);
    this.name = 'RateLimitationError';
  }
}

/**
 * Returns a 403 error because the user is not allowed to access the resource.
 *
 */
export class ForbiddenError extends AppError {
  constructor() {
    super('Forbidden', 403);
    this.name = 'ForbiddenError';
  }
}

/**
 * Returns a 403 error because the user is using an HTTP method that is not allowed
 *
 */
export class MethodNotAllowed extends AppError {
  constructor(method = 'UNKNOWN') {
    super(`HTTP Method: ${method} is not allowed`, 403);
    this.name = 'MethodNotAllowed';
  }
}

/**
 * Returns a 401 error because the user is not authorized to access the resource.
 *
 */
export class AuthorizationError extends AppError {
  constructor() {
    super('Unauthorized', 401);
    this.name = 'AuthorizationError';
  }
}

/**
 * Returns a 400 if there is a missing parameter.
 *
 */
export class MissingParameterError extends AppError {
  constructor(params?: string[]) {
    super(
      `Missing required parameter ${params ? `: ${params.join(', ')}` : ''}`,
      400
    );
    this.name = 'MissingParameterError';
  }
}

// Deprecated. Throw real errors instead of the functions below
export const missingParameter = (param) => {
  return { error: `Missing parameter: ${param}`, code: 400 };
};

export const notFoundError = { error: 'Not found', code: 404 };

export const unauthorizedError = { error: 'Unauthorized', code: 401 };

export const badRequestError = { error: 'Bad request', code: 400 };

export const internalError = (
  error = { errorInfo: string, message: string, code: string }
) => {
  const message =
    error.errorInfo || error.message || error.code || 'Internal Server Error';
  return { error: message, code: 500 };
};
