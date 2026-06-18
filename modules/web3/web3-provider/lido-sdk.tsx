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

// Safe runtime import cycle (web3-provider ↔ operator-provider): the context is
// only read inside useSmSDK's body at render time, never at module top-level.
import { NodeOperatorContext } from '../operator-provider/node-operator-provider';
import { overridedAddresses } from './devnet';

type LidoSDKContextValue = {
  chainId: CHAINS;
  core: LidoSDKCore;
  stake: LidoSDKStake;
  stETH: LidoSDKstETH;
  wstETH: LidoSDKwstETH;
  wrap: LidoSDKWrap;
  withdraw: LidoSDKWithdraw;
  sm: LidoSDKCsm | LidoSDKCm;
  csm: LidoSDKCsm;
  cm: LidoSDKCm;
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
 * Returns the SDK for the requested module ALWAYS, regardless of the active
 * module. Use for cross-module work (e.g. discovery across both modules) and
 * for the /create flow, where there is no active operator yet.
 * This deliberately bypasses the `config.module` guard that `useSmSDK(module)`
 * enforces — `useSmSDK(module)` returns `undefined` on a module mismatch.
 * Overloads narrow the return type to the concrete SDK for the requested
 * module so callers can reach module-specific surfaces (e.g. `permissionlessGate`,
 * `curatedGates`).
 */
export function useSmSDKByModule(module: MODULE_NAME.CSM): LidoSDKCsm;
export function useSmSDKByModule(module: MODULE_NAME.CM): LidoSDKCm;
export function useSmSDKByModule(module: MODULE_NAME): LidoSDKCsm | LidoSDKCm;
// eslint-disable-next-line func-style
export function useSmSDKByModule(module: MODULE_NAME) {
  const { csm, cm } = useLidoSDK();
  return module === MODULE_NAME.CSM ? csm : cm;
}

export function useSmSDK(): LidoSDKCsm | LidoSDKCm;
export function useSmSDK(module: MODULE_NAME.CSM): LidoSDKCsm | undefined;
export function useSmSDK(module: MODULE_NAME.CM): LidoSDKCm | undefined;
// eslint-disable-next-line func-style
export function useSmSDK(module?: MODULE_NAME) {
  const { csm, cm } = useLidoSDK();
  // Read the operator context WITHOUT throwing: useSmSDK is also called ABOVE
  // NodeOperatorProvider (e.g. GateSupported → useSmVersionSupported). With no
  // active operator (above the provider, or none resolved yet) fall back to the
  // deploy module — matching the original config.module-based semantics.
  const operatorCtx = useContext(NodeOperatorContext);
  const activeModule =
    operatorCtx?.activeModule ?? (config.module as MODULE_NAME);
  if (module) {
    if (module !== activeModule) return undefined;
    return module === MODULE_NAME.CSM ? csm : cm;
  }
  return activeModule === MODULE_NAME.CM ? cm : csm;
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

    const csm = new LidoSDKCsm(smProps);
    const cm = new LidoSDKCm(smProps);
    const sm = config.module === MODULE_NAME.CSM ? csm : cm;

    return {
      chainId: core.chainId,
      core,
      stake,
      stETH,
      wstETH,
      wrap,
      withdraw,
      sm,
      csm,
      cm,
    };
  }, [clApiUrl, ipfsGateways, publicClient, walletClient]);
  return (
    <LidoSDKContext.Provider value={contextValue}>
      {children}
    </LidoSDKContext.Provider>
  );
};
