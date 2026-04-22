import { StethPoolData, TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
} from 'shared/transaction-modal';
import { getBondWillReceive } from '../get-bond-will-receive';

type TxStageClaimProps = {
  claimRewards: boolean;
  amount: bigint;
  token: TOKENS;
  rewards?: bigint;
  poolData: StethPoolData;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageClaim = ({
  claimRewards,
  amount,
  token,
  rewards,
  poolData,
  isPending,
  txHash,
}: TxStageClaimProps) => {
  const [bondReceive, amountBiggerRewards] = getBondWillReceive(
    token,
    amount,
    claimRewards ? rewards : undefined,
    poolData,
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

          {bondReceive > 0 && (
            <p>
              Bond balance will increase by{' '}
              <TxAmount amount={bondReceive} token={TOKENS.steth} />.
            </p>
          )}
        </>
      }
    />
  );
};
