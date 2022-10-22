import pino from 'pino';

const isProd = process.env.VERCEL_ENV === 'production';

export const logger = pino(
  {
    formatters: {
      level(label) {
        return { level: label };
      },
    },
    messageKey: 'message',
    base: null,
    level: isProd ? 'info' : 'debug',
    timestamp: true,
  },
  process.stdout
);
