import { buildClientEnv } from './client-env.mjs';
// We're making dynamic env variables
// so we can inject selected envs from Docker runtime too,
// not only during build-time for static pages

export type ClientEnv = ReturnType<typeof buildClientEnv>;

declare global {
  interface Window {
    __env__: ClientEnv;
  }
}

// Don't use dynamics directly in the project!
// Only through:
// code```
//    import { config } from 'config'; // or
//    import { config } from './get-config'; // in config "namespace"
// ```
// server side reads live env: API routes use config.defaultChain/module
export default typeof window !== 'undefined'
  ? window.__env__
  : buildClientEnv();
