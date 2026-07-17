import { Instance } from 'prool';
import { createPublicClient, http } from 'viem';

export type ForkNodeOptions = {
  /** Upstream RPC to fork (RPC_URL). */
  forkUrl: string;
  mnemonic: string;
  port: number;
  host: string;
};

/**
 * prool@0.2.10 note: `Instance.anvil(opts)` returns a fully-formed `Instance`
 * (its factory calls `create()` internally) bound directly to `opts.host`/`opts.port`
 * via `.start()`/`.stop()` — no `Server`/`Pool` proxy involved, so the fork is
 * reachable at the bare `http://host:port` with no path suffix. `Server`/`Pool`
 * only matter when multiplexing several instances behind one port
 * (e.g. `http://localhost:8545/1`), which this single-fork use case doesn't need.
 */
type AnvilInstance = ReturnType<typeof Instance.anvil>;

let instance: AnvilInstance | undefined;

/** Start a prool-managed anvil fork (CI path). Requires the `anvil` binary on PATH. */
export const startForkNode = async (
  options: ForkNodeOptions,
): Promise<void> => {
  if (instance) return;
  instance = Instance.anvil({
    forkUrl: options.forkUrl,
    mnemonic: options.mnemonic,
    host: options.host,
    port: options.port,
  });
  await instance.start();
  console.info(
    `[forkNode] anvil fork listening on ${options.host}:${options.port}`,
  );
};

export const stopForkNode = async (): Promise<void> => {
  if (!instance) return;
  await instance.stop();
  instance = undefined;
  console.info('[forkNode] anvil stopped');
};

/** Fail fast with an actionable hint when no fork is reachable (local BYO-fork path). */
export const assertForkReachable = async (rpcUrl: string): Promise<void> => {
  const client = createPublicClient({ transport: http(rpcUrl) });
  try {
    await client.getChainId();
  } catch {
    throw new Error(
      `No EVM node reachable at ${rpcUrl}. Start your own fork first, e.g.:\n` +
        `  anvil --fork-url $RPC_URL --port ${new URL(rpcUrl).port}\n` +
        `(in CI the node is started automatically)`,
    );
  }
};
