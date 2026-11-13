import { useQuery } from '@tanstack/react-query';
import { useBondByKeysCount } from 'modules/web3';
import invariant from 'tiny-invariant';
import { useRemoveKeysFormData } from '../context';
import { calcBondBalance } from '@lidofinance/lido-csm-sdk';
import { getBondAfterRemoval } from '../remove-keys-state';

export const useBondBalanceAfterRemoveKeys = (count = 0) => {
  const { info, bond, removalFee, curve } = useRemoveKeysFormData(true);

  const { nextKeysCount, bondAfter } = getBondAfterRemoval({
    totalAddedKeys: info.totalAddedKeys,
    totalWithdrawnKeys: info.totalWithdrawnKeys,
    bondCurrent: bond.current,
    removalFee,
    count,
  });

  const { data: bondRequiredAfter } = useBondByKeysCount({
    keysCount: nextKeysCount,
    curve,
  });

  return useQuery({
    queryKey: [
      'getBondBalanceAfterRemoveKeys',
      { bondRequiredAfter, bondAfter },
    ],
    queryFn: () => {
      invariant(bondRequiredAfter !== undefined);
      return calcBondBalance({
        current: bondAfter,
        required: bondRequiredAfter,
        locked: 0n,
        debt: bond.debt,
        pendingToSplit: bond.pendingToSplit,
      });
    },
    enabled: bondRequiredAfter !== undefined,
  });
};
