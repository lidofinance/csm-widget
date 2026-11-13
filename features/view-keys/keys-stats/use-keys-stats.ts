import { CurveRef, MODULE_PROFILE } from '@lidofinance/lido-csm-sdk';
import {
  useCurveParameters,
  useModule,
  useNodeOperator,
  useNodeOperatorId,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
} from 'modules/web3';
import { useMemo } from 'react';
import { KeysStats, selectKeysStats } from './select-keys-stats';

type UseKeysStats = {
  stats: KeysStats | undefined;
  curve: CurveRef | undefined;
  showKeyBalance: boolean;
  isPending: boolean;
};

export const useKeysStats = (): UseKeysStats => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { nodeOperator } = useNodeOperator();
  const { data: info, isPending: infoPending } = useOperatorInfo({
    nodeOperatorId,
  });
  const { data: keys, isPending: keysPending } = useOperatorKeysWithStatus({
    nodeOperatorId,
  });
  const { data: curve, isPending: curvePending } =
    useOperatorCurveId(nodeOperator);
  const { data: keysLimit, isPending: limitPending } = useCurveParameters(
    curve,
    (params) => params.keysLimit,
  );

  const stats = useMemo(
    () => (info ? selectKeysStats({ info, keys, keysLimit }) : undefined),
    [info, keys, keysLimit],
  );

  return {
    stats,
    curve,
    showKeyBalance: !!module && MODULE_PROFILE[module].allocatedBalance,
    isPending:
      infoPending || keysPending || curvePending || (!!curve && limitPending),
  };
};
