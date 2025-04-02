import { TxStagePending } from '../tx-stages-basic/tx-stage-pending';
import { TxStageSign } from '../tx-stages-basic/tx-stage-sign';
import { TxAmount } from '../tx-stages-parts/tx-amount';

import { TOKENS } from 'consts/tokens';
import type { BigNumber } from 'ethers';
import { useBondWillReceive } from 'shared/hooks';

type TxStageClaimProps = {
  claimRewards: boolean;
  amount: BigNumber;
  token: TOKENS;
  rewards?: BigNumber;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageClaim = ({
  claimRewards,
  amount,
  token,
  rewards,
  isPending,
  txHash,
}: TxStageClaimProps) => {
  const [bondReceive, amountBiggerRewards] = useBondWillReceive(
    token,
    amount,
    claimRewards ? rewards : undefined,
  );

  const operationText =
    token === 'ETH' ? 'requesting withdrawal of' : 'claiming';
  const sourceText = claimRewards
    ? amountBiggerRewards
      ? 'bond and rewards'
      : 'rewards'
    : 'bond';
  const Component = isPending ? TxStagePending : TxStageSign;

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText} {sourceText}
        </>
      }
      description={
        <>
          <p>
            Rewards Address will receive{' '}
            <TxAmount amount={amount} token={token} />.
          </p>

          {bondReceive.gt(0) && (
            <p>
              Bond balance will increase by{' '}
              <TxAmount amount={bondReceive} token={TOKENS.STETH} />.
            </p>
          )}
        </>
      }
    />
  );
};
