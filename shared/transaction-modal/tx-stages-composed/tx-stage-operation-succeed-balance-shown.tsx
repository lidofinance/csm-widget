import { type FC } from 'react';

import { TxAmount } from '../tx-stages-parts/tx-amount';
import { SuccessText } from '../tx-stages-parts/success-text';
import { SkeletonBalance } from '../tx-stages-parts/skeleton-balance';
import { TxStageSuccess } from '../tx-stages-basic';
import type { ClosableOnLedgerStage } from '../is-closable-on-ledger';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

type TxStageOperationSucceedBalanceShownProps = {
  balance?: bigint;
  balanceToken: TOKENS;
  operationText: string;
  txHash?: string;
};

export const TxStageOperationSucceedBalanceShown: FC<TxStageOperationSucceedBalanceShownProps> &
  ClosableOnLedgerStage = ({
  balance,
  balanceToken,
  operationText,
  txHash,
}) => {
  const balanceEl = !!balance && (
    <TxAmount amount={balance} token={balanceToken} />
  );

  return (
    <TxStageSuccess
      txHash={txHash}
      title={
        <>
          Your Node Operator new balance is <wbr />
          {balance ? balanceEl : <SkeletonBalance />}
        </>
      }
      description={
        <SuccessText operationText={operationText} txHash={txHash} />
      }
      showEtherscan={false}
    />
  );
};

// Terminal stage: dismissible even on Ledger (modal is otherwise locked while
// a signature is pending).
TxStageOperationSucceedBalanceShown.isClosableOnLedger = true;
