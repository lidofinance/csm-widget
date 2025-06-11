import { useCallback, useMemo } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import { type RemoveKeysFormNetworkData } from './types';
import {
  useKeyRemovalFee,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
} from 'modules/web3';

export const useRemoveKeysFormNetworkData = (): [
  RemoveKeysFormNetworkData,
  () => Promise<void>,
] => {
  const nodeOperatorId = useNodeOperatorId();
  const {
    data: bond,
    isPending: isBondLoading,
    refetch: updateBond,
  } = useOperatorBalance(nodeOperatorId);
  const {
    data: info,
    isPending: isInfoLoading,
    refetch: updateInfo,
  } = useOperatorInfo(nodeOperatorId);

  const { data: curveId, isPending: isCurveIdLoading } =
    useOperatorCurveId(nodeOperatorId);
  const { data: removalFee, isPending: isRemovalFeeLoading } =
    useKeyRemovalFee(curveId);

  const {
    data: keys,
    initialLoading: isKeysLoading,
    update: updateKeys,
  } = useKeysWithStatus(true);

  const revalidate = useCallback(async () => {
    await Promise.allSettled([updateBond(), updateInfo(), updateKeys()]);
  }, [updateBond, updateInfo, updateKeys]);

  const loading = useMemo(
    () => ({
      isBondLoading,
      isInfoLoading,
      isCurveIdLoading,
      isKeysLoading,
      isRemovalFeeLoading,
    }),
    [
      isBondLoading,
      isCurveIdLoading,
      isInfoLoading,
      isKeysLoading,
      isRemovalFeeLoading,
    ],
  );

  return [
    {
      nodeOperatorId,
      curveId,
      removalFee,
      bond,
      keys,
      info,
      loading,
    },
    revalidate,
  ];
};
