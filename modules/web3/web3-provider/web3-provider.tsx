import { FC, PropsWithChildren, useEffect, useMemo } from 'react';
import { WagmiProvider, useConnections } from 'wagmi';
import * as wagmiChains from 'wagmi/chains';

import {
  ReefKnotWalletsModal,
  getDefaultWalletsModalConfig,
} from 'reef-knot/connect-wallet-modal';
import { ReefKnotProvider, getDefaultConfig } from 'reef-knot/core-react';
import { WalletIdsEthereum, WalletsListEthereum } from 'reef-knot/wallets';

import { useThemeToggle } from '@lidofinance/lido-ui';

import { config } from 'config';
import { useGetRpcUrlByChainId } from 'config/rpc';
import { useUserConfig } from 'config/user-config';
import { walletMetricProps } from 'consts/matomo-wallets-events';

import { useWeb3Transport } from './use-web3-transport';
import { SDKLegacyProvider } from './sdk-legacy';
import { LidoSDKProvider } from './lido-sdk';
import { CHAINS } from 'consts';

type ChainsList = [wagmiChains.Chain, ...wagmiChains.Chain[]];

const WALLETS_PINNED: WalletIdsEthereum[] = ['browserExtension'];

export const wagmiChainMap = Object.values(wagmiChains).reduce(
  (acc, chain) => {
    acc[chain.id] = chain;
    return acc;
  },
  {} as Record<number, wagmiChains.Chain>,
);

export const Web3Provider: FC<PropsWithChildren> = ({ children }) => {
  const {
    defaultChain: defaultChainId,
    supportedChainIds,
    walletconnectProjectId,
    isWalletConnectionAllowed,
  } = useUserConfig();
  const { themeName } = useThemeToggle();

  const { supportedChains, defaultChain } = useMemo(() => {
    // must preserve order of supportedChainIds
    const supportedChains = supportedChainIds
      .map((id) => wagmiChainMap[id])
      .filter((chain) => chain) as ChainsList;

    const defaultChain = wagmiChainMap[defaultChainId] || supportedChains[0];
    return {
      supportedChains,
      defaultChain,
    };
  }, [defaultChainId, supportedChainIds]);

  const getRpcUrlByChainId = useGetRpcUrlByChainId();

  const backendRPC: Record<number, string> = useMemo(
    () =>
      supportedChainIds.reduce(
        (res, curr) => ({ ...res, [curr]: getRpcUrlByChainId(curr as CHAINS) }),
        {},
      ),
    [supportedChainIds, getRpcUrlByChainId],
  );
  const { transportMap, onActiveConnection } = useWeb3Transport(
    supportedChains,
    backendRPC,
  );

  const { wagmiConfig, reefKnotConfig, walletsModalConfig } = useMemo(() => {
    return getDefaultConfig({
      // Reef-Knot config args
      rpc: backendRPC,
      defaultChain: defaultChain,
      walletconnectProjectId,
      walletsList: WalletsListEthereum,

      // Wagmi config args
      transports: transportMap,
      chains: supportedChains,
      autoConnect: isWalletConnectionAllowed,
      ssr: true,
      pollingInterval: config.PROVIDER_POLLING_INTERVAL,
      batch: {
        multicall: false,
      },

      // Wallets config args
      ...getDefaultWalletsModalConfig(),
      ...walletMetricProps,
      walletsPinned: WALLETS_PINNED,
    });
  }, [
    backendRPC,
    supportedChains,
    defaultChain,
    walletconnectProjectId,
    isWalletConnectionAllowed,
    transportMap,
  ]);

  const [activeConnection] = useConnections({ config: wagmiConfig });

  useEffect(() => {
    void onActiveConnection(activeConnection ?? null);
  }, [activeConnection, onActiveConnection]);

  return (
    // default wagmi autoConnect, MUST be false in our case, because we use custom autoConnect from Reef Knot
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <ReefKnotProvider config={reefKnotConfig}>
        <ReefKnotWalletsModal
          config={walletsModalConfig}
          darkThemeEnabled={themeName === 'dark'}
        />

        <LidoSDKProvider>
          <SDKLegacyProvider>{children}</SDKLegacyProvider>
        </LidoSDKProvider>
      </ReefKnotProvider>
    </WagmiProvider>
  );
};
