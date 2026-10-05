import { createContext, useContext, useEffect, useMemo } from 'react';
import invariant from 'tiny-invariant';
import {
  useConnection,
  useConfig,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from 'wagmi';

import {
  LidoSmSDK,
  MODULE_NAME,
  SdkProps,
  SmSDK,
  SmSDKFor,
} from '@lidofinance/lido-csm-sdk';
import { LidoSDKStake, LidoSDKWithdraw } from '@lidofinance/lido-ethereum-sdk';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';

import { config } from 'config';
import { useClApiUrl } from 'config/rpc/cl';
import { useUserConfig } from 'config/user-config';

// Safe runtime import cycle (web3-provider ↔ operator-provider): the context is
// only read inside useSmSDK's body at render time, never at module top-level.
import { NodeOperatorContext } from '../operator-provider/node-operator-provider';
import { devnetOverridedAddresses } from './devnet';

export type { SmSDK };
export type CsmFamilySDK = SmSDKFor<MODULE_NAME.CSM | MODULE_NAME.CSM_02>;

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  withdraw: LidoSDKWithdraw;
  sm: LidoSmSDK;
};

const chainId = config.defaultChain;

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

/**
 * Returns the requested module's SDK only while it is the active operator's
 * module — operator-scoped queries use the `undefined` to stay disabled.
 */
export const useActiveSmSDK = <M extends MODULE_NAME>(
  module: M,
): SmSDKFor<M> | undefined => {
  const { sm } = useLidoSDK();
  const operatorCtx = useContext(NodeOperatorContext);
  return module === operatorCtx?.activeModule ? sm.get(module) : undefined;
};

/**
 * Active operator's SDK, or — with `module` — that module's SDK whether or
 * not it is active.
 */
export function useSmSDK(): SmSDK | undefined;
export function useSmSDK<M extends MODULE_NAME>(
  module: M | undefined,
): SmSDKFor<M> | undefined;
// eslint-disable-next-line func-style
export function useSmSDK(...args: [module?: MODULE_NAME]) {
  const { sm } = useLidoSDK();
  const operatorCtx = useContext(NodeOperatorContext);
  // Only the zero-arg form means "active module"; an explicit undefined means "no module".
  if (args.length === 0) {
    const active = operatorCtx?.activeModule;
    return active ? sm.get(active) : undefined;
  }
  const [module] = args;
  return module ? sm.get(module) : undefined;
}

/** Active operator's SDK. Throws outside an operator-scoped tree. */
export const useActiveOperatorSDK = (): SmSDK => {
  const sdk = useSmSDK();
  invariant(sdk, 'useActiveOperatorSDK requires an active node operator');
  return sdk;
};

/** Resolves the SDK for `module`, falling back to the active operator's module. */
export const useTargetSmSDK = (module?: MODULE_NAME) => {
  const active = useSmSDK();
  const targetModule = module ?? active?.core.moduleName;
  const sdk = useSmSDK(targetModule);
  return { targetModule, sdk };
};

export const LidoSDKProvider = ({ children }: React.PropsWithChildren) => {
  const { data: walletClient } = useWalletClient({ chainId });
  const publicClient = usePublicClient({ chainId });
  // reset internal wagmi state after disconnect
  const { isConnected } = useConnection();

  const clApiUrl = useClApiUrl();
  const {
    savedUserConfig: { ipfsGateways: userIpfsGateways },
    defaultIpfsGateways,
  } = useUserConfig();
  const ipfsGateways =
    userIpfsGateways.length > 0 ? userIpfsGateways : defaultIpfsGateways;

  const wagmiConfig = useConfig();
  const { mutate: switchChain } = useSwitchChain();
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
    const withdraw = new LidoSDKWithdraw({ core });

    const smProps: SdkProps = {
      core,
      clApiUrl,
      maxEventBlocksRange:
        chainId === CHAINS.Mainnet
          ? undefined
          : config.MAX_BLOCK_RANGE_FOR_EVENTS,
      skipHistoricalCalls: chainId !== CHAINS.Mainnet,
      keysApiUrl: config.keysApiUrl,
      feesMonitoringApiUrl: config.feesMonitoringApiUrl,
      ipfsGateways: ipfsGateways,
    };

    const sm = new LidoSmSDK({
      ...smProps,
      overridedAddresses: devnetOverridedAddresses,
    });

    return {
      chainId: core.chainId,
      core,
      stake,
      withdraw,
      sm,
    };
  }, [clApiUrl, ipfsGateways, publicClient, walletClient]);
  return (
    <LidoSDKContext.Provider value={contextValue}>
      {children}
    </LidoSDKContext.Provider>
  );
};
