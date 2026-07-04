import { TxStageFail } from 'shared/transaction-modal/tx-stages-basic';
import { resolveError } from 'utils';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';

// Shared `failed` handler for transaction/modal stages: resolves the error once
// (classify + describe) and renders <TxStageFail>, which falls back to the
// static ERROR_META copy when the resolved description is undefined. Callers
// only vary the title (and occasionally modal props).
export const getFailedStage =
  (
    transitStage: TransactionModalTransitStage,
    title?: string,
    modalProps?: Parameters<TransactionModalTransitStage>[1],
  ) =>
  (error: unknown) => {
    const { code, description } = resolveError(error);
    return transitStage(
      <TxStageFail title={title} error={description} code={code} />,
      modalProps,
    );
  };
