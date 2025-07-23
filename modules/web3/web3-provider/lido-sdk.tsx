import { createContext, useContext, useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import {
  useAccount,
  useConfig,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';

import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import {
  LidoSDKstETH,
  LidoSDKwstETH,
} from '@lidofinance/lido-ethereum-sdk/erc20';

import { LidoSDKCsm } from '@lidofinance/lido-csm-sdk';
import { LidoSDKStake, LidoSDKWrap } from '@lidofinance/lido-ethereum-sdk';
import { config } from 'config';
import { useClApiUrl } from 'config/rpc/cl';

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  csm: LidoSDKCsm;
};

const chainId = config.defaultChain;

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

export const LidoSDKProvider = ({ children }: React.PropsWithChildren) => {
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  // reset internal wagmi state after disconnect
  const { isConnected } = useAccount();

  const clApiUrl = useClApiUrl();

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
    const core = new LidoSDKCore(
      // @ts-expect-error: typing (viem + LidoSDK)
      {
        chainId,
        // logMode: 'debug',
        rpcProvider: publicClient,
        web3Provider: walletClient,
      },
      'CSM',
    );

    const stake = new LidoSDKStake({ core });
    const stETH = new LidoSDKstETH({ core });
    const wstETH = new LidoSDKwstETH({ core });
    const wrap = new LidoSDKWrap({ core });
    const csm = new LidoSDKCsm({
      core,
      clApiUrl,
      // maxEventBlocksRange: config.MAX_BLOCK_RANGE_FOR_EVENTS,
    });

    return {
      chainId: core.chainId,
      core,
      stake,
      stETH,
      wstETH,
      wrap,
      csm,
    };
  }, [clApiUrl, publicClient, walletClient]);
  return (
    <LidoSDKContext.Provider value={contextValue}>
      {children}
    </LidoSDKContext.Provider>
  );
};
