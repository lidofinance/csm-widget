import { useMemo } from 'react';
import {
  useExtendedBondBalance,
  useMergeSwr,
  useNodeOperatorCurveId,
  useNodeOperatorFirstKeysBond,
} from 'shared/hooks';
import { NodeOperatorId } from 'types';
import { useRemoveKeysFormData } from '../context';
import { useRemovalFeeByKeysCount } from './useRemovalFeeByKeysCount';

export const useBondBalanceAfterRemoveKeys = (
  nodeOperatorId?: NodeOperatorId,
  count = 0,
) => {
  const { info, bond } = useRemoveKeysFormData();

  const nextKeysCount = useMemo(() => {
    return info
      ? info.totalAddedKeys - info.totalWithdrawnKeys - count
      : undefined;
  }, [count, info]);

  const swrCurveId = useNodeOperatorCurveId(nodeOperatorId);
  const swrRequiredAfter = useNodeOperatorFirstKeysBond({
    keysCount: nextKeysCount,
    curveId: swrCurveId.data,
  });

  const swrRemovalFee = useRemovalFeeByKeysCount(count);
  const bondAfter = useMemo(
    () => bond?.current.sub(swrRemovalFee.data || 0),
    [bond, swrRemovalFee.data],
  );
  const bondBalance = useExtendedBondBalance(swrRequiredAfter.data, bondAfter);

  return useMergeSwr(
    [swrCurveId, swrRequiredAfter, swrRemovalFee],
    bondBalance,
  );
};
