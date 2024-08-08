import {
  TxStageFail,
  TxStagePermit,
  TxStageSuccessMultisig,
} from 'shared/transaction-modal/tx-stages-basic';
import { getErrorMessage, getTokenDisplayName } from 'utils';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';
import { TOKENS } from 'consts/tokens';
import { TxStageSignOperationAmount } from '../tx-stages-composed';
import { BigNumber } from 'ethers';

export const getGeneralTransactionModalStages = (
  transitStage: TransactionModalTransitStage,
) => ({
  signPermit: () => transitStage(<TxStagePermit />), // TODO: show token & amount
  signApproval: (amount: BigNumber, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={getTokenDisplayName(token)}
      />,
    ),
  pendingApproval: (amount: BigNumber, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={getTokenDisplayName(token)}
        isPending
        txHash={txHash}
      />,
    ),
  successMultisig: () =>
    transitStage(<TxStageSuccessMultisig />, {
      isClosableOnLedger: true,
    }),
  failed: (error: unknown, onRetry?: () => void) =>
    transitStage(
      <TxStageFail failedText={getErrorMessage(error)} onRetry={onRetry} />,
      {
        isClosableOnLedger: true,
      },
    ),
});
