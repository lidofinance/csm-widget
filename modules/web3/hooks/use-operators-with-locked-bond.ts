import { STETH_ROUNDING_THRESHOLD } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATORS_WITH_LOCKED_BOND = ['operators-with-locked-bond'];

export const useOperatorsWithLockedBond = () => {
  const { delayedPenalty, core } = useSmSDK();

  return useQuery({
    queryKey: [...KEY_OPERATORS_WITH_LOCKED_BOND, { module: core.moduleName }],
    ...STRATEGY_CONSTANT,
    queryFn: () => delayedPenalty.getOperatorsWithLockedBond(),
    select: (data) =>
      data.filter(({ locked }) => locked > STETH_ROUNDING_THRESHOLD),
  });
};
