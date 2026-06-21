import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK, useSmSDKByModule } from '../web3-provider';

export const useSmStatus = () => {
  const { module, core } = useSmSDK();

  return useQuery({
    queryKey: ['sm-status', { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: () => module.getStatus(),
    select: (data) => ({
      ...data,
      isPaused: data.isPausedAccounting || data.isPausedModule,
    }),
  });
};

// GateSupported is a pre-operator, module-agnostic gate mounted ABOVE
// NodeOperatorProvider, so the reactive useSmSDK() here would resolve to the
// deploy module only — checking one module. Read BOTH modules statically and
// treat the widget as supported when AT LEAST ONE module is on a supported
// contract version: a not-yet-deployed module (e.g. CM in development) resolves
// to version 0n = unsupported and must not brick the other module's production
// experience. allSettled keeps one module's RPC error from failing the gate.
export const useSmVersionSupported = () => {
  const csm = useSmSDKByModule(MODULE_NAME.CSM);
  const cm = useSmSDKByModule(MODULE_NAME.CM);

  return useQuery({
    queryKey: ['sm-version-supported', { chainId: csm.core.chainId }],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      const results = await Promise.allSettled([
        csm.module.isVersionsSupported(),
        cm.module.isVersionsSupported(),
      ]);
      return results.some((r) => r.status === 'fulfilled' && r.value);
    },
  });
};
