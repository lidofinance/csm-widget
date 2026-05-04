import { type DependencyList, useCallback } from 'react';
import {
  buildTxCallback,
  type FlowStages,
  type TxModalStagesFactory,
} from 'shared/hook-form/form-controller';
import { getGeneralTransactionModalStages } from './get-general-transaction-modal-stages';
import { useTransitStage } from './use-transit-stage';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';

type CustomStages<R> = Pick<FlowStages<R>, 'sign' | 'pending' | 'success'> &
  Partial<Omit<FlowStages<R>, 'sign' | 'pending' | 'success'>>;

export const useTxStages = <I, D, R = undefined>(
  buildStages: (
    transitStage: TransactionModalTransitStage,
    input: I,
    data: D,
  ) => CustomStages<R>,
  deps: DependencyList = [],
): TxModalStagesFactory<I, D, R> => {
  const transitStage = useTransitStage();

  return useCallback(
    (input: I, data: D) =>
      buildTxCallback<R>({
        ...getGeneralTransactionModalStages(transitStage),
        ...buildStages(transitStage, input, data),
      }),
    // buildStages is intentionally excluded — caller controls deps via `deps` param
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [transitStage, ...deps],
  );
};
