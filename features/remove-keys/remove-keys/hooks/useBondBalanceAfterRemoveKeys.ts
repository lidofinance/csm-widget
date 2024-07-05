import {
  useExtendedBondBalance,
  useNodeOperatorBalance,
  useNodeOperatorCurveId,
  useNodeOperatorFirstKeysBond,
  useNodeOperatorInfo,
} from 'shared/hooks';
import { useMemo } from 'react';
import { NodeOperatorId } from 'types';
import { mergeSwr } from 'utils';
import { useRemovalFeeByKeysCount } from './useRemovalFeeByKeysCount';

export const useBondBalanceAfterRemoveKeys = (
  nodeOperatorId?: NodeOperatorId,
  count = 0,
) => {
  const swrInfo = useNodeOperatorInfo(nodeOperatorId);
  const nextKeysCount = useMemo(() => {
    return swrInfo.data
      ? swrInfo.data.totalAddedKeys - swrInfo.data.totalExitedKeys - count
      : undefined;
  }, [count, swrInfo.data]);

  const swrCurveId = useNodeOperatorCurveId(nodeOperatorId);
  const swrRequiredAfter = useNodeOperatorFirstKeysBond({
    keysCount: nextKeysCount,
    curveId: swrCurveId.data,
  });

  const swrRemovalFee = useRemovalFeeByKeysCount(count);
  const swrBalance = useNodeOperatorBalance(nodeOperatorId);
  const bondAfter = useMemo(
    () => swrBalance.data?.current.sub(swrRemovalFee.data || 0),
    [swrBalance.data, swrRemovalFee.data],
  );
  const bondBalance = useExtendedBondBalance(swrRequiredAfter.data, bondAfter);

  return mergeSwr(
    [swrInfo, swrCurveId, swrRequiredAfter, swrRemovalFee],
    bondBalance,
  );
};
