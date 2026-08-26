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
  LidoSDKCm,
  LidoSDKCsm,
  LidoSDKCsm02,
  MODULE_NAME,
  SdkProps,
} from '@lidofinance/lido-csm-sdk';
import {
  LidoSDKStake,
  LidoSDKWithdraw,
  LidoSDKWrap,
} from '@lidofinance/lido-ethereum-sdk';
import { CHAINS, LidoSDKCore } from '@lidofinance/lido-ethereum-sdk/core';
import {
  LidoSDKstETH,
  LidoSDKwstETH,
} from '@lidofinance/lido-ethereum-sdk/erc20';

import { config } from 'config';
import { useClApiUrl } from 'config/rpc/cl';
import { useUserConfig } from 'config/user-config';
import { deployedModules } from 'consts';

// Safe runtime import cycle (web3-provider ↔ operator-provider): the context is
// only read inside useSmSDK's body at render time, never at module top-level.
import { NodeOperatorContext } from '../operator-provider/node-operator-provider';
import { overridedAddresses } from './devnet';

export type SmSDK = LidoSDKCsm | LidoSDKCsm02 | LidoSDKCm;
export type CsmFamilySDK = LidoSDKCsm | LidoSDKCsm02;

type SmSdkMap = Partial<Record<MODULE_NAME, SmSDK>>;

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  withdraw: LidoSDKWithdraw;
  sm: SmSdkMap;
};

const chainId = config.defaultChain;

const SM_SDK_CONSTRUCTORS = {
  [MODULE_NAME.CSM]: LidoSDKCsm,
  [MODULE_NAME.CM]: LidoSDKCm,
  [MODULE_NAME.CSM_02]: LidoSDKCsm02,
} as const;

// The primary module must construct — a throw here is fatal by design. Secondary
// modules are dropped from the runtime set instead, so an availability/SDK
// mismatch on rollout fails closed rather than crashing the app.
const buildSmSdkMap = (smProps: SdkProps): SmSdkMap => {
  const map: SmSdkMap = {};
  for (const mod of deployedModules) {
    if (mod === config.module) {
      map[mod] = new SM_SDK_CONSTRUCTORS[mod](smProps);
    } else {
      try {
        map[mod] = new SM_SDK_CONSTRUCTORS[mod](smProps);
      } catch (error) {
        console.error(`[lido-sdk] dropping module ${mod}:`, error);
      }
    }
  }
  return map;
};

const LidoSDKContext = createContext<LidoSDKContextValue | null>(null);
LidoSDKContext.displayName = 'LidoSDKContext';

export const useLidoSDK = () => {
  const value = useContext(LidoSDKContext);
  invariant(value, 'useLidoSDK was used outside of LidoSDKProvider');
  return value;
};

/**
 * Returns the requested module's SDK regardless of which module is active,
 * deliberately bypassing the active-module guard that `useSmSDK(module)` enforces.
 */
export function useSmSDKByModule(
  module: MODULE_NAME.CSM,
): LidoSDKCsm | undefined;
export function useSmSDKByModule(
  module: MODULE_NAME.CSM_02,
): LidoSDKCsm02 | undefined;
export function useSmSDKByModule(module: MODULE_NAME.CM): LidoSDKCm | undefined;
export function useSmSDKByModule(module: MODULE_NAME): SmSDK | undefined;
// eslint-disable-next-line func-style
export function useSmSDKByModule(module: MODULE_NAME) {
  const { sm } = useLidoSDK();
  return sm[module];
}

export function useSmSDK(): SmSDK;
export function useSmSDK(module: MODULE_NAME.CSM): LidoSDKCsm | undefined;
export function useSmSDK(module: MODULE_NAME.CSM_02): LidoSDKCsm02 | undefined;
export function useSmSDK(module: MODULE_NAME.CM): LidoSDKCm | undefined;
// eslint-disable-next-line func-style
export function useSmSDK(module?: MODULE_NAME) {
  const { sm } = useLidoSDK();
  // Read without throwing: useSmSDK is also called above NodeOperatorProvider
  // (e.g. GateSupported), where falling back to the primary avoids the #526 SSR 500.
  const operatorCtx = useContext(NodeOperatorContext);
  const activeModule = operatorCtx?.activeModule ?? config.module;
  if (module) {
    if (module !== activeModule) return undefined;
    return sm[module];
  }
  return sm[activeModule];
}

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
    const stETH = new LidoSDKstETH({ core });
    const wstETH = new LidoSDKwstETH({ core });
    const wrap = new LidoSDKWrap({ core });
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
      overridedAddresses,
    };

    const sm = buildSmSdkMap(smProps);

    return {
      chainId: core.chainId,
      core,
      stake,
      stETH,
      wstETH,
      wrap,
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
