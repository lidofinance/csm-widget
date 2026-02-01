import { useQuery } from '@tanstack/react-query';
import { MODULE, STRATEGY_IMMUTABLE } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const useDefaultCurveId = () => {
  const sdk = useSmSDK(MODULE.CSM);

  return useQuery({
    queryKey: ['default-curve-id'],
    ...STRATEGY_IMMUTABLE,
    queryFn: () => {
      invariant(sdk);
      return sdk.permissionlessGate.getCurveId();
    },
    enabled: !!sdk,
  });
};
