import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { Address } from 'shared/components';
import {
  TxAmount,
  TxStagePending,
  TxStageSign,
} from 'shared/transaction-modal';
import { ClaimBreakdown } from './use-claim-breakdown';

type TxStageClaimProps = {
  breakdown: ClaimBreakdown;
  rewardsAddress: string;
  feeSplitsCount: number;
  isPending?: boolean;
  txHash?: string;
};

export const TxStageClaim = ({
  breakdown,
  rewardsAddress,
  feeSplitsCount,
  isPending,
  txHash,
}: TxStageClaimProps) => {
  const {
    coverAmount,
    splittable,
    toRA,
    toRAToken,
    token,
    bondDelta,
    debtBurned,
    debtRemain,
    includesRewards,
    hasSplits,
    isRewardsToBond,
  } = breakdown;

  // Source label: "bond" when no rewards pulled, "rewards" when only rewards
  // are being delivered to RA, "bond and rewards" when both flow to RA.
  // bondDelta < 0 means existing excess bond is being claimed alongside rewards.
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

  const hasPrimary =
    (hasSplits && splittable > 0n) || toRA > 0n || bondDelta !== 0n;
  const hasSecondary =
    (includesRewards && coverAmount > STETH_ROUNDING_THRESHOLD) ||
    (includesRewards && debtBurned > 0n) ||
    debtRemain > 0n;

  return (
    <Component
      txHash={txHash}
      title={
        <>
          You are {operationText} {sourceText}
        </>
      }
      description={
        <Receipt>
          {hasSplits && splittable > 0n && (
            <Row
              label={`Splitters (${feeSplitsCount})`}
              value={<TxAmount amount={splittable} token={TOKENS.steth} />}
            />
          )}
          {toRA > 0n && (
            <Row
              label={
                <>
                  Rewards Address
                  <AddressLine>
                    <Address
                      address={rewardsAddress}
                      size="xxs"
                      weight={700}
                      color="secondary"
                      link={<></>}
                    />
                  </AddressLine>
                </>
              }
              value={<TxAmount amount={toRAToken} token={token} />}
            />
          )}
          {bondDelta > 0n && (
            <Row
              label={isRewardsToBond ? 'Bond' : 'Excess bond'}
              value={
                <>
                  +<TxAmount amount={bondDelta} token={TOKENS.steth} />
                </>
              }
            />
          )}
          {bondDelta < 0n && (
            <Row
              label="Excess bond"
              value={
                <>
                  −<TxAmount amount={-bondDelta} token={TOKENS.steth} />
                </>
              }
            />
          )}

          {hasPrimary && hasSecondary && <Divider />}

          {includesRewards && coverAmount > STETH_ROUNDING_THRESHOLD && (
            <Row
              muted
              label="Compensation for the Insufficient Bond"
              value={<TxAmount amount={coverAmount} token={TOKENS.steth} />}
            />
          )}
          {includesRewards && debtBurned > 0n && (
            <Row
              muted
              label="Bond debt covered"
              value={<TxAmount amount={debtBurned} token={TOKENS.steth} />}
            />
          )}
          {debtRemain > 0n && (
            <Row
              muted
              label="Bond debt remaining"
              value={<TxAmount amount={debtRemain} token={TOKENS.steth} />}
            />
          )}
        </Receipt>
      }
    />
  );
};

type RowProps = { label: ReactNode; value: ReactNode; muted?: boolean };
const Row = ({ label, value, muted }: RowProps) => (
  <>
    <Label $muted={muted}>{label}</Label>
    <Value $muted={muted}>{value}</Value>
  </>
);

const Receipt = styled.div`
  display: inline-grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: ${({ theme }) => theme.spaceMap.lg}px;
  row-gap: ${({ theme }) => theme.spaceMap.xs}px;
  text-align: left;
  margin-top: ${({ theme }) => theme.spaceMap.md}px;
  max-width: 100%;
  align-items: baseline;
`;

const Label = styled.div<{ $muted?: boolean }>`
  color: var(
    --lido-color-${({ $muted }) => ($muted ? 'textSecondary' : 'text')}
  );
  font-size: ${({ theme, $muted }) =>
    $muted ? theme.fontSizesMap.xxs : theme.fontSizesMap.xs}px;
  line-height: 1.4;
`;

const Value = styled.div<{ $muted?: boolean }>`
  color: var(
    --lido-color-${({ $muted }) => ($muted ? 'textSecondary' : 'text')}
  );
  font-weight: ${({ $muted }) => ($muted ? 400 : 700)};
  font-size: ${({ theme, $muted }) =>
    $muted ? theme.fontSizesMap.xxs : theme.fontSizesMap.xs}px;
  text-align: right;
  white-space: nowrap;
`;

const Divider = styled.div`
  grid-column: 1 / -1;
  border-top: 1px solid var(--lido-color-border);
  margin: ${({ theme }) => theme.spaceMap.xs}px 0;
`;

const AddressLine = styled.span`
  display: block;
  margin-top: 2px;
`;
