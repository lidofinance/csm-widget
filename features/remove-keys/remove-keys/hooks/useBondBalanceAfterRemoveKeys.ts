import { useQuery } from '@tanstack/react-query';
import { useBondByKeysCount } from 'modules/web3';
import invariant from 'tiny-invariant';
import { useRemoveKeysFormData } from '../context';
import { calcBondBalance } from '@lidofinance/lido-csm-sdk';

export const useBondBalanceAfterRemoveKeys = (count = 0) => {
  const { info, bond, removalFee, curveId } = useRemoveKeysFormData();

  const nextKeysCount = info
    ? info.totalAddedKeys - info.totalWithdrawnKeys - count
    : 0;

  const { data: bondRequiredAfter } = useBondByKeysCount({
    keysCount: nextKeysCount,
    curveId,
  });

  const bondAfter = (bond?.current ?? 0n) - (removalFee || 0n) * BigInt(count);

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
      });
    },
    enabled: bondRequiredAfter !== undefined,
  });
};
