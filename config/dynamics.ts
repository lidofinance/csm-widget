import { buildClientEnv } from './client-env.mjs';

export type ClientEnv = ReturnType<typeof buildClientEnv>;

declare global {
  interface Window {
    __env__: ClientEnv;
  }
}

// Don't use dynamics directly: read config through `config` / `useConfig`.
// Browser gets `window.__env__` (see /runtime/window-env.js); server builds it from live env.
export default typeof window !== 'undefined'
  ? window.__env__
  : buildClientEnv();
