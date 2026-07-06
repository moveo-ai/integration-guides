// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
import dotenv from 'dotenv';
dotenv.config();

const { TextDecoder, TextEncoder } = require('node:util');
const {
  ReadableStream,
  WritableStream,
  TransformStream,
} = require('node:stream/web');
const { MessageChannel, MessagePort } = require('node:worker_threads');

// Polyfills required by undici v8 / msw v2 — must be defined before undici is
// imported below, otherwise loading undici throws `MessagePort is not defined`.
Object.defineProperties(globalThis, {
  TextDecoder: { value: TextDecoder },
  TextEncoder: { value: TextEncoder },
  ReadableStream: { value: ReadableStream },
  WritableStream: { value: WritableStream },
  TransformStream: { value: TransformStream },
  MessageChannel: { value: MessageChannel },
  MessagePort: { value: MessagePort },
  BroadcastChannel: {
    value: class BroadcastChannel {
      postMessage() {}
      close() {}
      addEventListener() {}
      removeEventListener() {}
    },
  },
});

const { Blob, File } = require('node:buffer');
const { fetch, Headers, FormData, Request, Response } = require('undici');

// `configurable`/`writable` so msw's interceptors can wrap Request/Response.
Object.defineProperties(globalThis, {
  fetch: { value: fetch, configurable: true, writable: true },
  Blob: { value: Blob, configurable: true, writable: true },
  File: { value: File, configurable: true, writable: true },
  Headers: { value: Headers, configurable: true, writable: true },
  FormData: { value: FormData, configurable: true, writable: true },
  Request: { value: Request, configurable: true, writable: true },
  Response: { value: Response, configurable: true, writable: true },
});
