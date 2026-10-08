import { markNotReady } from './readiness.mjs';

const SHUTDOWN_TIMEOUT_MS = 9_000;
const DEFAULT_DRAIN_MS = 5_000;
const MAX_TIMER_MS = 2 ** 31 - 1;

const parseDrainMs = (raw) => {
  if (raw === undefined || raw.trim() === '') return DEFAULT_DRAIN_MS;
  const value = Number(raw);
  return Number.isFinite(value) && value >= 0 && value <= MAX_TIMER_MS
    ? value
    : DEFAULT_DRAIN_MS;
};

/** Marks not-ready, drains `drainMs` on SIGTERM (none on SIGINT), closes `server`; forces exit `timeoutMs` after the signal. */
export const registerShutdownSignals = (
  server,
  {
    timeoutMs = SHUTDOWN_TIMEOUT_MS,
    drainMs = parseDrainMs(process.env.SHUTDOWN_DRAIN_MS),
    exit = (code) => {
      process.exit(code);
    },
  } = {},
) => {
  let shuttingDown = false;
  let exited = false;
  const exitOnce = () => {
    if (exited) return;
    exited = true;
    exit(0);
  };

  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    markNotReady(`shutting down (${signal})`);

    const forceExitTimer = setTimeout(() => {
      console.error(
        `[shutdown] Shutdown timed out after ${timeoutMs}ms, forcing exit`,
      );
      exitOnce();
    }, timeoutMs);
    forceExitTimer.unref();

    const close = () => {
      server.close((error) => {
        clearTimeout(forceExitTimer);
        if (error) {
          console.error(`[shutdown] Server close failed: ${error.message}`);
        }
        exitOnce();
      });
    };

    // keep-alive clients must reconnect to other pods while draining
    server.prependListener('request', (_req, res) => {
      res.setHeader('Connection', 'close');
    });

    if (signal === 'SIGTERM' && drainMs > 0) {
      // kube-proxy/ingress/LB lag behind EndpointSlice removal; keep serving meanwhile
      console.info(`[shutdown] Received ${signal}, draining for ${drainMs}ms`);
      setTimeout(close, drainMs);
    } else {
      console.info(`[shutdown] Received ${signal}, closing`);
      close();
    }
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
};
