const FORCE_EXIT_TIMEOUT_MS = 10_000;

/** Drains `server` on SIGTERM/SIGINT, forcing exit after `forceExitMs` if the drain stalls. */
export const registerShutdownSignals = (
  server,
  {
    forceExitMs = FORCE_EXIT_TIMEOUT_MS,
    exit = (code) => {
      process.exit(code);
    },
  } = {},
) => {
  let shuttingDown = false;

  const shutdown = (signal) => {
    if (shuttingDown) return;
    shuttingDown = true;

    console.info(`[shutdown] Received ${signal}, draining`);

    let exited = false;
    const exitOnce = () => {
      if (exited) return;
      exited = true;
      exit(0);
    };

    const forceExitTimer = setTimeout(() => {
      console.error(
        `[shutdown] Drain timed out after ${forceExitMs}ms, forcing exit`,
      );
      exitOnce();
    }, forceExitMs);
    forceExitTimer.unref();

    server.close((error) => {
      clearTimeout(forceExitTimer);
      if (error) {
        console.error(`[shutdown] Server close failed: ${error.message}`);
      }
      exitOnce();
    });
    // close() alone waits out every idle keep-alive socket (keepAliveTimeout, 5s)
    server.closeIdleConnections();
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
};
