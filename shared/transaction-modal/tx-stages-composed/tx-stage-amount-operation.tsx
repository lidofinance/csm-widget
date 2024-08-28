import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxAmount } from '../tx-stages-parts/tx-amount';

import type { BigNumber } from 'ethers';
import { TOKENS } from 'consts/tokens';

type TxStageSignOperationAmountProps = {
  amount: BigNumber;
  token: TOKENS;
  operationText: string;
  willReceive?: BigNumber;
  willReceiveToken?: TOKENS;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageSignOperationAmount = ({
  amount,
  token,
  willReceive,
  willReceiveToken,
  operationText,
  isPending,
  txHash,
}: TxStageSignOperationAmountProps) => {
  const amountEl = <TxAmount amount={amount} token={token} />;
  const willReceiveEl = willReceive && willReceiveToken && (
    <TxAmount amount={willReceive} token={willReceiveToken} />
  );
  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText.toLowerCase()} {amountEl}
        </>
      }
      description={
        !isPending && (
          <>
            {operationText} {amountEl}.{' '}
            {willReceiveEl && (
              <>
                <br />
                RewardAddress will receive {willReceiveEl}.
              </>
            )}
          </>
        )
      }
    />
  );
};
