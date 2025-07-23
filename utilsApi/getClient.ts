import { CSM_SUPPORTED_CHAINS, LidoSDKCsm } from '@lidofinance/lido-csm-sdk';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk';
import { config, secretConfig } from 'config';
import { PublicClient, createPublicClient, fallback, http } from 'viem';
import * as chains from 'viem/chains';

const rpcUrls: Partial<Record<CSM_SUPPORTED_CHAINS, [string, ...string[]]>> = {
  [CHAINS.Mainnet]: secretConfig.rpcUrls_1,
  [CHAINS.Holesky]: secretConfig.rpcUrls_17000,
  [CHAINS.Hoodi]: secretConfig.rpcUrls_560048,
};

let client: LidoSDKCsm | undefined = undefined;

export const getClient = () => {
  if (client) return client;
  const chainId = config.defaultChain;
  const chain = Object.values(chains).find((c) => c.id === chainId);
  const urls = rpcUrls[chainId as CSM_SUPPORTED_CHAINS];
  if (!urls) {
    throw new Error(`Error: RPC is not configured for chain ${chainId}`);
  }
  const batch = {
    wait: config.PROVIDER_BATCH_TIME,
    batchSize: config.PROVIDER_MAX_BATCH,
  };
  const publicClient = createPublicClient({
    chain,
    transport: fallback([
      ...urls.map((url) => http(url, { batch, name: url })),
      http(),
    ]),
  }) as PublicClient;

  const core = new LidoSDKCore(
    {
      chainId,
      rpcProvider: publicClient,
    },
    'CSM',
  );

  const csm = new LidoSDKCsm({ core });
  client = csm;

  return csm;
};
