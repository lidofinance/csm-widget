import React, { PropsWithChildren, useMemo } from 'react';
import { useAccount, usePublicClient } from 'wagmi';

import { type Network, Web3Provider } from '@ethersproject/providers';
import { ProviderSDK } from '@lido-sdk/react';

import { useLidoSDK } from './lido-sdk';
import { config } from 'config';
import { useMainnetStaticRpcProvider } from 'shared/hooks/use-mainnet-static-rpc-provider';

// Stabilizes network detection to prevent repeated chainId calls
class EthersToViemProvider extends Web3Provider {
  detectNetwork(): Promise<Network> {
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!this._cache['detectNetwork']) {
      this._cache['detectNetwork'] = this._uncachedDetectNetwork();
    }
    return this._cache['detectNetwork'];
  }
}

export const SDKLegacyProvider = ({ children }: PropsWithChildren) => {
  const { supportedChains: supportedChainIds, PROVIDER_POLLING_INTERVAL } =
    config;
  const { address } = useAccount();
  const { core, chainId } = useLidoSDK();

  const ethersWeb3Provider = useMemo(() => {
    if (!core.web3Provider) return undefined;

    const { chain, web3Provider } = core;
    const transport = web3Provider.transport;

    const provider = new Web3Provider(transport, {
      chainId: chain.id,
      name: chain.name,
      ensAddress: chain.contracts?.ensRegistry?.address,
    });
    provider.pollingInterval = PROVIDER_POLLING_INTERVAL;
    return provider;
  }, [core, PROVIDER_POLLING_INTERVAL]);

  const publicClient = usePublicClient({ chainId });
  const publicMainnetClient = usePublicClient({ chainId: 1 });

  const providerRpc = useMemo(() => {
    return (
      publicClient && new EthersToViemProvider(publicClient.transport, chainId)
    );
  }, [chainId, publicClient]);

  // Fallback for when mainnet is not present in supported chains
  const staticMainnetProvider = useMainnetStaticRpcProvider();

  const providerMainnetRpc = useMemo(() => {
    return publicMainnetClient
      ? new EthersToViemProvider(publicMainnetClient.transport, 1)
      : staticMainnetProvider;
  }, [publicMainnetClient, staticMainnetProvider]);

  return (
    // @ts-expect-error Property children does not exist on type
    <ProviderSDK
      chainId={chainId as any}
      supportedChainIds={supportedChainIds}
      providerWeb3={ethersWeb3Provider}
      providerRpc={providerRpc}
      providerMainnetRpc={providerMainnetRpc}
      account={ethersWeb3Provider && address ? address : undefined}
    >
      {children}
    </ProviderSDK>
  );
};
