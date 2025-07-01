import { KEY_STATUS } from '@lidofinance/lido-csm-sdk';
import {
  useKeyRemovalFee,
  useNodeOperatorId,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { useCallback, useMemo } from 'react';
import { hasStatus } from 'utils';
import { type RemoveKeysFormNetworkData } from './types';

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
    isPending: isKeysLoading,
    refetch: updateKeys,
  } = useOperatorKeysWithStatus(nodeOperatorId, (keys) =>
    keys.filter(
      hasStatus([
        KEY_STATUS.DEPOSITABLE,
        KEY_STATUS.DUPLICATED, // TODO: check active duplicated key is here?
        KEY_STATUS.INVALID,
      ]),
    ),
  );

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
