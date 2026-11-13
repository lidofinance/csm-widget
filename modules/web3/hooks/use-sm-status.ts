import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { SmSDK, useLidoSDK, useTargetSmSDK } from '../web3-provider';
import { getImpliedVersionSupport, getSmVersionKey } from './sm-version-query';

export const fetchSmStatus = async (sdk: SmSDK) => {
  const [status, registration] = await Promise.all([
    sdk.module.getStatus(),
    sdk.module.getRegistration(),
  ]);
  return { ...status, ...registration };
};

export const useSmStatus = (module?: MODULE_NAME) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: ['sm-status', { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return fetchSmStatus(sdk);
    },
    enabled: !!sdk,
    select: (data) => ({
      ...data,
      isPaused: data.isPausedAccounting || data.isPausedModule,
    }),
  });
};

/** No module → supported only if every deployed module is. */
export const useSmVersionSupported = (module?: MODULE_NAME) => {
  const { sm } = useLidoSDK();
  const queryClient = useQueryClient();
  const all = [...sm.modules.values()];
  const target = module ? [sm.get(module)] : all;

  return useQuery({
    queryKey: getSmVersionKey(target.map((s) => s?.core.moduleName)),
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      const results = await Promise.all(
        target.map((s) => {
          invariant(s);
          return s.module.isVersionsSupported();
        }),
      );
      return results.every(Boolean);
    },
    // the first operator flips module undefined → X; without this GateSupported splashes and unmounts the page
    placeholderData: () =>
      getImpliedVersionSupport(
        queryClient,
        all.map((s) => s.core.moduleName),
      ),
  });
};
