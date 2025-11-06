import { useQuery } from '@tanstack/react-query';
import { useBondByKeysCount } from 'modules/web3';
import invariant from 'tiny-invariant';
import { useRemoveKeysFormData } from '../context';
import { calcBondBalance } from '@lidofinance/lido-csm-sdk';

export const useBondBalanceAfterRemoveKeys = (count = 0) => {
  const { info, bond, removalFee, curveId } = useRemoveKeysFormData(true);

  const nextKeysCount = info.totalAddedKeys - info.totalWithdrawnKeys - count;

  const { data: bondRequiredAfter } = useBondByKeysCount({
    keysCount: nextKeysCount,
    curveId,
  });

  const bondAfter = bond.current - removalFee * BigInt(count);

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
