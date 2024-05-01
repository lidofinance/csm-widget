import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxAmount } from '../tx-stages-parts/tx-amount';

import type { BigNumber } from 'ethers';
import { NodeOperatorId } from 'types';

type TxStageSignOperationAmountProps = {
  amount?: BigNumber;
  token?: string;
  keysCount: number;
  operationText: string;
  nodeOperatorId?: NodeOperatorId;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationKeys = ({
  amount,
  token,
  operationText,
  keysCount,
  nodeOperatorId,
  isPending,
  txHash,
}: TxStageSignOperationAmountProps) => {
  const amountEl = amount && token && (
    <TxAmount amount={amount} symbol={token} />
  );
  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={<>Your keys are {operationText.toLowerCase()}</>}
      description={
        !isPending && (
          <>
            {operationText} {keysCount} key(s){' '}
            {amount && <>and depositing {amountEl}</>}.{' '}
            {nodeOperatorId && (
              <>
                <br />
                NO#{nodeOperatorId}.
              </>
            )}
          </>
        )
      }
    />
  );
};
