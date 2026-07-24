import { useMemo } from 'react';
import { TransactionModal } from '../transaction-modal';
import { useTransitStage } from './use-transit-stage';

export type TransactionModalTransitStage = (
  TxStageEl: React.ReactNode,
  modalProps?: Omit<React.ComponentProps<typeof TransactionModal>, 'children'>,
) => void;

// eslint-disable-next-line @typescript-eslint/ban-types
export const useTransactionModalStage = <S extends Record<string, Function>>(
  getStages: (transitStage: TransactionModalTransitStage) => S,
) => {
  const transitStage = useTransitStage();

  const txModalStages = useMemo(
    () => getStages(transitStage),
    [getStages, transitStage],
  );

  return {
    txModalStages,
  };
};
