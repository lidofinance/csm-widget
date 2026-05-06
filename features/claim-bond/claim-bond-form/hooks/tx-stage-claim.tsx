import { TOKENS } from '@lidofinance/lido-csm-sdk';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
} from 'shared/transaction-modal';

type TxStageClaimProps = {
  claimRewards: boolean;
  isRewardsToBond: boolean;
  amount: bigint;
  token: TOKENS;
  toRA: bigint;
  bondDelta: bigint;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageClaim = ({
  claimRewards,
  isRewardsToBond,
  amount,
  token,
  toRA,
  bondDelta,
  isPending,
  txHash,
}: TxStageClaimProps) => {
  // Source label: "bond" when no rewards pulled, "rewards" when only rewards
  // are being delivered to RA, "bond and rewards" when both flow to RA.
  // bondDelta < 0 means existing excess bond is being claimed alongside rewards.
  const sourceText = !claimRewards
    ? 'bond'
    : isRewardsToBond
      ? 'rewards'
      : bondDelta < 0n
        ? 'bond and rewards'
        : 'rewards';
  const operationText =
    token === TOKENS.eth ? 'requesting withdrawal of' : 'claiming';

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
          {toRA > 0n && (
            <p>
              Rewards Address will receive{' '}
              <TxAmount amount={amount} token={token} />.
            </p>
          )}
          {bondDelta > 0n && (
            <p>
              {isRewardsToBond ? 'Bond balance' : 'Excess bond'} will increase
              by <TxAmount amount={bondDelta} token={TOKENS.steth} />.
            </p>
          )}
          {bondDelta < 0n && (
            <p>
              Excess bond will decrease by{' '}
              <TxAmount amount={-bondDelta} token={TOKENS.steth} />.
            </p>
          )}
        </>
      }
    />
  );
};
