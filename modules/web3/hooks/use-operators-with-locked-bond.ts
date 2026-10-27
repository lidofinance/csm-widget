import {
  MODULE_NAME,
  STETH_ROUNDING_THRESHOLD,
} from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useTargetSmSDK } from '../web3-provider';

export const KEY_OPERATORS_WITH_LOCKED_BOND = ['operators-with-locked-bond'];

export const useOperatorsWithLockedBond = (module?: MODULE_NAME) => {
  const { targetModule, sdk } = useTargetSmSDK(module);

  return useQuery({
    queryKey: [...KEY_OPERATORS_WITH_LOCKED_BOND, { module: targetModule }],
    ...STRATEGY_CONSTANT,
    queryFn: () => {
      invariant(sdk);
      return sdk.delayedPenalty.getOperatorsWithLockedBond();
    },
    enabled: !!sdk,
    select: (data) =>
      data.filter(({ locked }) => locked > STETH_ROUNDING_THRESHOLD),
  });
};
