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
// import { CHAINS } from '../consts';
import { LidoSDKStake, LidoSDKWrap } from '@lidofinance/lido-ethereum-sdk';
import { LidoSDKCsm } from '@lidofinance/lido-csm-sdk';
import { DEVNET } from './devnet';

type LidoSDKContextValue = {
  chainId: CHAINs;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  csm: LidoSDKCsm;
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
      logMode: 'info',
      rpcProvider: publicClient,
      web3Provider: walletClient,
    });

    const stake = new LidoSDKStake({ core });
    const stETH = new LidoSDKstETH({ core });
    const wstETH = new LidoSDKwstETH({ core });
    const wrap = new LidoSDKWrap({ core });
    const csm = new LidoSDKCsm({
      core,
      // overridedAddresses: {
      //   csAccounting: DEVNET.CSAccounting,
      //   csModule: DEVNET.CSModule,
      //   csFeeDistributor: DEVNET.CSFeeDistributor,
      //   csFeeOracle: DEVNET.CSFeeOracle,
      //   csVerifier: DEVNET.CSVerifier,
      //   hashConsensus: DEVNET.HashConsensus,
      //   csEjector: DEVNET.CSEjector,
      //   csParametersRegistry: DEVNET.CSParametersRegistry,
      //   csStrikes: DEVNET.CSStrikes,
      //   permissionlessGate: DEVNET.PermissionlessGate,
      //   vettedGate: DEVNET.VettedGate,
      // },
    });

    return {
      chainId: core.chainId as unknown as CHAINS,
      core,
      stake,
      stETH,
      wstETH,
      wrap,
      csm,
      subscribeToTokenUpdates: subscribe,
    };
  }, [chainId, publicClient, subscribe, walletClient]);
  return (
    <LidoSDKContext.Provider value={contextValue}>
      {children}
    </LidoSDKContext.Provider>
  );
};
