import {
  Address as AppAddress,
  DataList,
  DataListRow,
} from '@lidofinance/lido-app-ui';
import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import styled from 'styled-components';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
} from 'shared/transaction-modal';
import { ClaimBreakdown } from '../claim-breakdown';

type ReceiptProps = {
  breakdown: ClaimBreakdown;
  rewardsAddress: string;
  feeSplitsCount: number;
};

type TxStageClaimProps = ReceiptProps & {
  isPending?: boolean;
  txHash?: string;
};

const getReceiptParts = ({
  coverAmount,
  splittable,
  toRA,
  bondDelta,
  debtBurned,
  debtRemain,
  includesRewards,
  hasSplits,
}: ClaimBreakdown) => {
  const showSplitters = hasSplits && splittable > 0n;
  const showCover = includesRewards && coverAmount > STETH_ROUNDING_THRESHOLD;
  const showDebtBurned = includesRewards && debtBurned > 0n;
  const showDebtRemain = debtRemain > 0n;

  return {
    showSplitters,
    showCover,
    showDebtBurned,
    showDebtRemain,
    hasPrimary: showSplitters || toRA > 0n || bondDelta !== 0n,
    hasSecondary: showCover || showDebtBurned || showDebtRemain,
  };
};

const ClaimReceipt: FC<ReceiptProps> = ({
  breakdown,
  rewardsAddress,
  feeSplitsCount,
}) => {
  const {
    coverAmount,
    splittable,
    toRA,
    toRAToken,
    token,
    bondDelta,
    debtBurned,
    debtRemain,
    isRewardsToBond,
  } = breakdown;
  const parts = getReceiptParts(breakdown);

  return (
    <ReceiptAppStyle>
      {parts.hasPrimary && (
        <DataList>
          {parts.showSplitters && (
            <DataListRow
              label={`Splitters (${feeSplitsCount})`}
              value={<TxAmount amount={splittable} token={TOKENS.steth} />}
            />
          )}
          {toRA > 0n && (
            <DataListRow
              label="Rewards Address"
              description={
                <AppAddress
                  address={rewardsAddress}
                  symbols={6}
                  identicon={20}
                />
              }
              value={<TxAmount amount={toRAToken} token={token} />}
            />
          )}
          {bondDelta > 0n && (
            <DataListRow
              label={isRewardsToBond ? 'Bond' : 'Excess bond'}
              value={
                <>
                  +<TxAmount amount={bondDelta} token={TOKENS.steth} />
                </>
              }
            />
          )}
          {bondDelta < 0n && (
            <DataListRow
              label="Excess bond"
              value={
                <>
                  −<TxAmount amount={-bondDelta} token={TOKENS.steth} />
                </>
              }
            />
          )}
        </DataList>
      )}
      {parts.hasSecondary && (
        <DataList>
          {parts.showCover && (
            <DataListRow
              label="Compensation for the Insufficient Bond"
              value={<TxAmount amount={coverAmount} token={TOKENS.steth} />}
            />
          )}
          {parts.showDebtBurned && (
            <DataListRow
              label="Bond debt covered"
              value={<TxAmount amount={debtBurned} token={TOKENS.steth} />}
            />
          )}
          {parts.showDebtRemain && (
            <DataListRow
              label="Bond debt remaining"
              value={<TxAmount amount={debtRemain} token={TOKENS.steth} />}
            />
          )}
        </DataList>
      )}
    </ReceiptAppStyle>
  );
};

export const TxStageClaim = ({
  breakdown,
  rewardsAddress,
  feeSplitsCount,
  isPending,
  txHash,
}: TxStageClaimProps) => {
  const { token, bondDelta, includesRewards, isRewardsToBond } = breakdown;

  // "bond" without rewards, "rewards" when only rewards reach the RA,
  // "bond and rewards" when existing excess bond is claimed alongside.
  const sourceText = !includesRewards
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
        <ClaimReceipt
          breakdown={breakdown}
          rewardsAddress={rewardsAddress}
          feeSplitsCount={feeSplitsCount}
        />
      }
    />
  );
};

const ReceiptAppStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  text-align: left;
`;
