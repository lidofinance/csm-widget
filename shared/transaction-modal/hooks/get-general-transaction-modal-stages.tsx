import { TOKENS } from 'consts/tokens';
import { BigNumber } from 'ethers';
import {
  TxStageFail,
  TxStagePermit,
  TxStageSuccessMultisig,
} from 'shared/transaction-modal/tx-stages-basic';
import { getErrorCode } from 'utils';
import { TxStageSignOperationAmount } from '../tx-stages-composed';
import type { TransactionModalTransitStage } from './use-transaction-modal-stage';

export const getGeneralTransactionModalStages = (
  transitStage: TransactionModalTransitStage,
) => ({
  signPermit: () => transitStage(<TxStagePermit />), // TODO: show token & amount
  signApproval: (amount: BigNumber, token: TOKENS) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={token}
      />,
    ),
  pendingApproval: (amount: BigNumber, token: TOKENS, txHash?: string) =>
    transitStage(
      <TxStageSignOperationAmount
        operationText="Unlocking"
        amount={amount}
        token={token}
        isPending
        txHash={txHash}
      />,
    ),
  successMultisig: () =>
    transitStage(<TxStageSuccessMultisig />, {
      isClosableOnLedger: true,
    }),
  failed: (error: unknown, onRetry?: () => void) =>
    transitStage(<TxStageFail code={getErrorCode(error)} onRetry={onRetry} />, {
      isClosableOnLedger: true,
    }),
});
