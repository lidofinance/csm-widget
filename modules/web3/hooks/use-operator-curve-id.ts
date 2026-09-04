import { CurveRef } from '@lidofinance/lido-csm-sdk';
import { useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { OperatorRef } from '../operator-provider/types';
import { useSmSDKByModule } from '../web3-provider';

export const KEY_OPERATOR_CURVE_ID = ['operator-curve-id'];

export const useOperatorCurveId = <TData = CurveRef>(
  operator: OperatorRef | undefined,
  select?: (data: CurveRef) => TData,
) => {
  const sdk = useSmSDKByModule(operator?.module);

  return useQuery({
    queryKey: [
      ...KEY_OPERATOR_CURVE_ID,
      operator && {
        nodeOperatorId: operator.nodeOperatorId,
        module: operator.module,
      },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(operator && sdk);
      const curveId = await sdk.operator.getCurveId(operator.nodeOperatorId);
      // Tag from the instance that answered, not from the argument.
      const ref: CurveRef = { curveId, module: sdk.core.moduleName };
      return ref;
    },
    enabled: !!operator && !!sdk,
    select,
  });
};
