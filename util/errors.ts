import pino from 'pino';

export class AppError extends Error {
  code = 500;

  static fromError(logger: pino.Logger, innerError: Error): AppError {
    if (innerError instanceof AppError) {
      return innerError as AppError;
    }

    // Parse SOAP errors from Pisti
    // Fault: {
    //   Code: {
    //     Value: 'soap:Sender',
    //     Subcode: { value: 'rpc:BadArguments' }
    //   },
    //   Reason: { Text: 'Processing Error' },
    //   statusCode: 500
    // }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const soapError = innerError as any;
    if (soapError.Fault) {
      logger.error(soapError, 'Parsing SOAP error');
      const message = soapError?.Fault?.Reason?.Text || soapError.message;
      const code = soapError?.Fault?.statusCode || 500;

      const error = new AppError(message, code);
      error.stack = soapError.stack;
      return error;
    }

    // Axios errors
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axiosError = innerError as any;
    if (axiosError.response) {
      const { response } = axiosError;
      logger.error(
        {
          headers: response?.headers,
          status: response?.status,
        },
        `HTTP error: ${response.data}`
      );
      const error = new AppError(
        response.data?.error,
        response.data?.code || response?.status
      );
      error.stack = axiosError.stack;
      return error;
    }

    const error = new AppError(innerError.message, 500);
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
  constructor(method: string) {
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
