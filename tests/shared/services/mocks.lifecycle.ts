import { startServer as startClServer } from '@sm-lab/cl';
import { startServer as startIpfsServer } from '@sm-lab/ipfs';

export type MocksOptions = {
  clHost: string;
  clPort: number;
  clUpstreamUrl?: string;
  ipfsHost: string;
  ipfsPort: number;
  ipfsUpstreamGateway?: string;
};

/**
 * Both `@sm-lab/cl` and `@sm-lab/ipfs` `startServer` are thin wrappers over `@sm-lab/core`'s
 * `startServer`, which boots `@hono/node-server`'s `serve()` — a plain Node `http.Server`
 * (`ServerType` in `@hono/node-server`, i.e. `net.Server`). It exposes a `listening` boolean,
 * emits `'listening'` once the socket is actually bound, and emits `'error'` (e.g.
 * `EADDRINUSE`) if the bind fails instead. Its `.close(callback?: (err?: Error) => void): this`
 * and `.once`/`.off` are structurally assignable to this narrower handle, so no cast is needed
 * at the call sites.
 */
type ServerHandle = {
  readonly listening: boolean;
  once(
    event: 'listening' | 'error',
    listener: (err?: Error) => void,
  ): ServerHandle;
  off(
    event: 'listening' | 'error',
    listener: (err?: Error) => void,
  ): ServerHandle;
  close: (cb?: (err?: Error) => void) => void;
};

let clHandle: ServerHandle | undefined;
let ipfsHandle: ServerHandle | undefined;

const closeHandle = (handle: ServerHandle): Promise<void> =>
  new Promise((resolve, reject) =>
    handle.close((err) => (err ? reject(err) : resolve())),
  );

/**
 * Awaits the handle's `'listening'` event so callers only see a server as "up" once the socket
 * is actually bound. Rejects if `'error'` fires first (e.g. `EADDRINUSE`), turning a bind
 * failure into a clean rejected promise instead of an uncaught exception. Guards against the
 * (unlikely but possible) race where the server is already listening by the time we attach.
 */
const waitForListening = (handle: ServerHandle): Promise<void> =>
  new Promise((resolve, reject) => {
    if (handle.listening) {
      resolve();
      return;
    }
    const onListening = () => {
      handle.off('error', onError);
      resolve();
    };
    const onError = (err?: Error) => {
      handle.off('listening', onListening);
      reject(err ?? new Error('Mock server failed to start'));
    };
    handle.once('listening', onListening);
    handle.once('error', onError);
  });

/** Start the in-process CL + IPFS mocks (offline test bed). Idempotent. */
export const startMocks = async (options: MocksOptions): Promise<void> => {
  if (!clHandle) {
    const handle = startClServer(options.clPort, options.clHost, {
      port: options.clPort,
      host: options.clHost,
      upstreamUrl: options.clUpstreamUrl,
    });
    await waitForListening(handle);
    clHandle = handle;
    console.info(
      `[mocks] cl-mock listening on ${options.clHost}:${options.clPort}`,
    );
  }
  if (!ipfsHandle) {
    const handle = startIpfsServer({
      port: options.ipfsPort,
      host: options.ipfsHost,
      gateway: options.ipfsUpstreamGateway,
    });
    await waitForListening(handle);
    ipfsHandle = handle;
    console.info(
      `[mocks] ipfs-mock listening on ${options.ipfsHost}:${options.ipfsPort}`,
    );
  }
};

export const stopMocks = async (): Promise<void> => {
  const toClose: Array<[label: string, handle: ServerHandle | undefined]> = [
    ['cl-mock', clHandle],
    ['ipfs-mock', ipfsHandle],
  ];
  clHandle = undefined;
  ipfsHandle = undefined;

  const results = await Promise.allSettled(
    toClose.map(async ([label, handle]) => {
      if (!handle) return;
      await closeHandle(handle);
      console.info(`[mocks] ${label} stopped`);
    }),
  );

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === 'rejected')
    .map((r) => r.reason);
  if (errors.length > 0) {
    throw new AggregateError(errors, 'Failed to stop one or more mock servers');
  }
};
