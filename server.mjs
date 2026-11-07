import { createServer } from 'http';
import { readFileSync } from 'fs';
import path from 'path';
import next from 'next';
import { registerShutdownSignals } from './scripts/shutdown.mjs';
import { toBoolean } from './scripts/to-boolean.mjs';
import { buildCspHeader } from './config/csp/policy.mjs';
import { buildClientEnv, serializeClientEnv } from './config/client-env.mjs';
import { logEnvironmentVariables } from './scripts/log-environment-variables.mjs';
import { startupCheckRPCs } from './scripts/startup-checks/rpc.mjs';
import { startupCheckValidationFile } from './scripts/startup-checks/validation-file.mjs';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = Number(process.env.PORT) || 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();
// cannot import from next.config.mjs because this will break env load
const CACHE_CONTROL_HEADER = 'x-cache-control';
// document TTL, same literal as next.config.mjs (config/groups/cache.spec.ts keeps them equal)
const CACHE_CONTROL_VALUE =
  'public, max-age=15, s-maxage=30, stale-if-error=86400, stale-while-revalidate=60';

const loadDevnetAddresses = () => {
  const filePath = process.env.DEVNET_ADDRESSES_FILE_PATH;
  if (!filePath) return null;
  try {
    return JSON.parse(readFileSync(path.resolve(filePath), 'utf-8'));
  } catch (e) {
    console.warn('Failed to load devnet addresses:', e.message);
    return null;
  }
};

const createWindowEnvRoute = (basePath) => {
  const routePath = `${basePath}/runtime/window-env.js`;
  const clientEnv = buildClientEnv(process.env, {
    devnetAddresses: loadDevnetAddresses(),
  });
  const body = `window.__env__=${serializeClientEnv(clientEnv)};`;

  return (req, res, pathname) => {
    if (pathname !== routePath || (req.method !== 'GET' && req.method !== 'HEAD')) {
      return false;
    }
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    res.setHeader('Cache-Control', CACHE_CONTROL_VALUE);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.end(req.method === 'HEAD' ? undefined : body);
    return true;
  };
};

// allows us to override cache-control header
const overrideSetHeader = (res) => {
  const setHeader = res.setHeader;
  let cacheControlOverwritten = false;
  res.setHeader = function (header, value) {
    if (header.toLowerCase() === CACHE_CONTROL_HEADER) {
      cacheControlOverwritten = true;

      return setHeader.call(this, 'Cache-Control', value);
    }

    // no-store must win over the overwritten value: Next's renderError sets it on SSR error pages
    if (
      header.toLowerCase() === 'cache-control' &&
      cacheControlOverwritten &&
      !/no-store/i.test(String(value))
    ) {
      return this;
    }

    return setHeader.call(this, header, value);
  };
};

app
  .prepare()
  .then(async () => {
    // Next loads .env* inside prepare(), so env logging, window-env and checks must run
    // after it; config errors throw before the port opens, RPC reachability is only logged
    logEnvironmentVariables();
    // must match next.config.mjs basePath (baked at build)
    const basePath = process.env.BASE_PATH ?? '';
    const serveWindowEnv = createWindowEnvRoute(basePath);
    // runtime env, so not in next.config headers() (serialized at build)
    const csp = dev
      ? null
      : buildCspHeader({
          trustedHosts: process.env.CSP_TRUSTED_HOSTS,
          reportUri: process.env.CSP_REPORT_URI,
          reportOnly: process.env.CSP_REPORT_ONLY,
        });
    const isApiOrAsset = (pathname = '') =>
      pathname.startsWith(`${basePath}/api/`) ||
      pathname.startsWith(`${basePath}/_next/`);
    if (toBoolean(process.env.RUN_STARTUP_CHECKS)) {
      void startupCheckRPCs();
      await startupCheckValidationFile();
    }

    const server = createServer(async (req, res) => {
      try {
        const { pathname } = new URL(req.url ?? '/', 'http://localhost');

        overrideSetHeader(res);

        if (csp && !isApiOrAsset(pathname)) {
          res.setHeader(csp.name, csp.value);
        }

        if (serveWindowEnv(req, res, pathname)) return;

        await handle(req, res);
      } catch (err) {
        // an unhandled rejection here kills the process (--unhandled-rejections=throw); `new URL` throws on e.g. `GET http://[ HTTP/1.1`
        console.error(err);
        if (!res.headersSent) {
          res.statusCode = 500;
          res.end();
        } else {
          res.destroy();
        }
      }
    })
      .once('error', (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, () => {
        console.debug(`> Ready on http://${hostname}:${port}`);
      });
    // prevents malicious client from slowly sending headers and rest of request
    server.headersTimeout = 10_000;
    server.requestTimeout = 30_000;
    server.maxHeadersCount = 50;
    registerShutdownSignals(server);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
