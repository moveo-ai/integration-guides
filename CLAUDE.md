# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Next.js repository containing templates, examples, and guides for integrating webhooks and webviews with the Moveo Virtual Assistant platform. The project demonstrates how customers can build custom integrations to extend VA capabilities.

## Development Commands

### Installation
```bash
npm install --legacy-peer-deps
```
Note: `--legacy-peer-deps` is required due to dependency conflicts.

### Development
```bash
npm run dev  # Starts dev server on localhost:3000
```

### Testing
```bash
npm test            # Run all tests with Jest
npm run test:watch  # Run tests in watch mode
```

Tests use Jest with jsdom environment, MSW for API mocking, and @testing-library/react for component testing.

### Linting and Code Quality
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Auto-fix linting errors
npm run prettier      # Format code with Prettier
```

### Build
```bash
npm run build  # Production build
npm start      # Start production server
```

## Project Architecture

### Next.js Page Structure

The repository follows Next.js conventions with two distinct integration types:

1. **Webhooks** (`/pages/api/**/*.ts`)
   - HTTP endpoints for 3rd-party API integrations
   - Called by Moveo VA to fetch data, trigger actions, or augment session context
   - All webhook handlers wrapped with `errorHandlerMiddleware` for logging and error handling
   - Return `WebhookResponse` type: `{ output: MoveoContext, responses?: Action[] }`

2. **Webviews** (`/pages/**/*.tsx`)
   - Interactive HTML forms/displays shown within VA chat interface
   - Use `useWebview` hook for Moveo integration (context passing, closing webview)
   - Support multiple channels: facebook, viber, web, sunco, etc.
   - RSA encryption for secure data transmission (keys documented in README.md)

### Key Directories

- `pages/api/` - Webhook implementations organized by use case (ecommerce, book-tickets, lead-generation)
- `pages/` - Webview React components
- `middlewares/` - Request processing (error-handler, body-raw-parser, rate-limit)
- `types/moveo.d.ts` - Core type definitions for Moveo API contracts
- `hooks/` - React hooks (`useWebview`, `useSurvey`, `useColorTheme`)
- `lib/` - Channel-specific SDKs (Facebook, Sunco) and Moveo API clients
- `util/` - Shared utilities, validators (Yup schemas), error classes

### Webhook Architecture

All webhook handlers follow this pattern:
```typescript
import { NextApiResponse } from 'next';
import errorHandlerMiddleware from '../../../middlewares/error-handler';
import { NextApiRequestWithLog, WebhookResponse } from '../../../types/moveo';

const handler = (req: NextApiRequestWithLog, res: NextApiResponse<WebhookResponse>) => {
  if (req.method !== 'POST') {
    throw new MethodNotAllowed(req.method);
  }

  // Business logic here

  return res.json({
    responses: [], // Optional Action[] to send back to user
    output: {      // Context variables (snake_case)
      variable_name: value,
    },
  });
};

export default errorHandlerMiddleware(handler);
```

Key patterns:
- All webhooks wrapped with `errorHandlerMiddleware` for request logging and error handling
- Use `NextApiRequestWithLog` for typed request with `req.log` (pino logger)
- HMAC signature verification via `checkHmacSignature()` for secure webhooks
- Query params accessed via `req.query`, body via `req.body`
- Carousel responses limited to 5 cards (`MAX_CARDS_PER_CAROUSEL`)

### Webview Architecture

Webviews use `useWebview` hook to communicate with Moveo:
```typescript
const { closeWebview, sendContext, getContext, params } = useWebview('demo');

// Send form data back to VA as context variables
await sendContext({ user_name: 'John', email: 'john@example.com' });

// Close the webview modal
closeWebview();
```

URL parameters passed to webviews:
- `channel` - facebook, viber, web, sunco, etc.
- `integration_id` - Moveo integration identifier
- `session_id` - Current chat session
- `user_id` - End user identifier
- `trigger_node_id` - Optional node to trigger after webview closes
- `lang` - Brain language (el, en, ro, pt-br, it, de, es, fr, bg)

### Type System

Core types in `types/moveo.d.ts`:
- `NextApiRequestWithLog` - Extended Next.js request with pino logger
- `WebhookResponse` - Webhook return structure
- `MoveoContext` - Key-value context (snake_case keys)
- `Action` - Discriminated union of response types (text, carousel, webview, handover, etc.)
- `CarouselCardProps` - Carousel card structure with buttons
- `MoveoChannel` - Supported channel types

## Code Style Guidelines

### Naming Conventions
- **Files**: kebab-case (`get-events.ts`, not `getEvents.ts`)
- **Moveo context variables**: snake_case (`withdrawal_amount: 30`)
- **TypeScript**: camelCase for variables/functions, PascalCase for types/components
- **React components**: PascalCase with default export

### Testing
- Tests colocated in `__tests__/` folders or `.test.ts` files
- Use MSW for mocking API requests (`setupServer` from `msw/node`)
- Mock external SDKs (Facebook, Sunco) with `jest.mock()`
- Example test structure in `hooks/__tests__/useWebview.test.ts`

### Error Handling
- All webhook handlers must use `errorHandlerMiddleware`
- Custom error classes in `util/errors.ts`: `AppError`, `MethodNotAllowed`, `AuthorizationError`
- Errors automatically logged with pino and returned as JSON with status codes

## Testing Webhooks Locally

After starting dev server (`npm run dev`), test webhooks with curl:

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -H "X-Moveo-Signature: 7b2e526f80d3ad094ee0a2ccc2501afdab7044f89839f9fcba9466d15a967774" \
  -d '{"lang": "el", "channel":"web", "context": {"firstname": "John", "lastname": "Snow"}}' \
  "localhost:3000/api/common/random-number-generator?max=100&min=1"
```

The X-Moveo-Signature is an HMAC signature for request verification (see README for test keys).

## Important Notes

- Use `--legacy-peer-deps` for all npm install operations
- Context variables sent to/from Moveo must be snake_case
- Carousel responses are limited to 5 cards maximum
- Facebook webviews require page context (psid) from Facebook SDK
- All API handlers receive enriched requests with logging via middleware
- Environment variables should be in `.env.local` (not tracked in git)
