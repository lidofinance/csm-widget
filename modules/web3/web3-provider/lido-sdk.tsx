import { createContext, useContext, useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import {
  useAccount,
  useConfig,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';

import { LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import {
  LidoSDKstETH,
  LidoSDKwstETH,
} from '@lidofinance/lido-ethereum-sdk/erc20';

import { config } from 'config';
import { useTokenTransferSubscription } from 'modules/web3/hooks/use-balance';
import { CHAINS } from '../consts';

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  subscribeToTokenUpdates: ReturnType<typeof useTokenTransferSubscription>;
};

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

export const LidoSDKProvider = ({ children }: React.PropsWithChildren) => {
  const subscribe = useTokenTransferSubscription();

  // will only have
  const { chainId: walletChain } = useAccount();
  const chainId = useMemo(
    () =>
      walletChain && config.supportedChains.includes(walletChain)
        ? walletChain
        : config.defaultChain,
    [walletChain],
  );
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  // reset internal wagmi state after disconnect
  const { isConnected } = useAccount();

  const wagmiConfig = useConfig();
  const { switchChain } = useSwitchChain();
  useEffect(() => {
    if (isConnected) {
      return () => {
        // protecs from side effect double run
        if (!wagmiConfig.state.current) {
          switchChain({
            chainId: config.defaultChain,
          });
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const contextValue = useMemo(() => {
    // @ts-expect-error: typing (viem + LidoSDK)
    const core = new LidoSDKCore({
      chainId,
      logMode: 'none',
      rpcProvider: publicClient,
      web3Provider: walletClient,
    });

    const stETH = new LidoSDKstETH({ core });
    const wstETH = new LidoSDKwstETH({ core });

    return {
      chainId: core.chainId as unknown as CHAINS,
      core,
      stETH,
      wstETH,
      subscribeToTokenUpdates: subscribe,
    };
  }, [chainId, publicClient, subscribe, walletClient]);
  return (
    <LidoSDKContext.Provider value={contextValue}>
      {children}
    </LidoSDKContext.Provider>
  );
};
