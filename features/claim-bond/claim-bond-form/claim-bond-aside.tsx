import { DataListRow } from '@lidofinance/lido-app-ui';
import { STETH_ROUNDING_THRESHOLD, TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { Address } from 'shared/components';
import { SubmitAside, SubmitButton } from 'shared/form-page';
import { FormatToken } from 'shared/formatters';
import { useClaimBondFormData } from './context';
import { SplittersRow } from './controls/splitters-row';
import { useClaimBreakdown } from './hooks/use-claim-breakdown';
import { useClaimOptions } from './hooks/use-claim-options';

const InfoRows: FC = () => {
  const { rewardsAddress, feeSplits } = useClaimBondFormData(true);
  const {
    coverAmount,
    splittableGross,
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
  } = useClaimBreakdown();

  return (
    <>
      {includesRewards && coverAmount > STETH_ROUNDING_THRESHOLD && (
        <DataListRow
          label="Compensation for the Insufficient Bond"
          value={<FormatToken amount={coverAmount} token={TOKENS.steth} />}
        />
      )}
      {includesRewards && debtBurned > 0n && (
        <DataListRow
          label="Bond debt covered"
          info="Outstanding bond debt is automatically burned from the bond on every rewards distribution and deposit"
          value={<FormatToken amount={debtBurned} token={TOKENS.steth} />}
        />
      )}
      {debtRemain > 0n && (
        <DataListRow
          label="Bond debt remaining"
          info="Bond debt that cannot be covered yet — it will be paid down by future rewards or deposits"
          value={<FormatToken amount={debtRemain} token={TOKENS.steth} />}
        />
      )}
      {hasSplits && splittable > 0n && (
        <SplittersRow feeSplits={feeSplits} amount={splittableGross} />
      )}
      {toRA > 0n && (
        <DataListRow
          label={
            <>
              Rewards Address (
              <Address
                address={rewardsAddress}
                size="xxs"
                weight={700}
                color="secondary"
              />
              ) will receive
            </>
          }
          info="The recipient of the claim is the Rewards Address. You can change the Rewards Address on the Settings tab."
          value={<FormatToken amount={toRAToken} token={token} />}
          dataTestId={{ root: 'claimBondFormInfoTitle' }}
        />
      )}
      {bondDelta > 0n && (
        <DataListRow
          label={
            isRewardsToBond
              ? 'Bond will receive'
              : 'Excess bond will increase by'
          }
          value={<FormatToken amount={bondDelta} token={TOKENS.steth} />}
        />
      )}
      {bondDelta < 0n && (
        <DataListRow
          label="Excess bond will decrease by"
          value={<FormatToken amount={-bondDelta} token={TOKENS.steth} />}
          dataTestId={{ root: 'bondDecreaseRow' }}
        />
      )}
    </>
  );
};

const ClaimSubmitButton: FC = () => {
  const { submitLabel } = useClaimOptions();
  return <SubmitButton>{submitLabel}</SubmitButton>;
};

const useHasRows = () => {
  const {
    coverAmount,
    splittable,
    toRA,
    bondDelta,
    debtBurned,
    debtRemain,
    includesRewards,
    hasSplits,
  } = useClaimBreakdown();

  return (
    (includesRewards && coverAmount > STETH_ROUNDING_THRESHOLD) ||
    (includesRewards && debtBurned > 0n) ||
    debtRemain > 0n ||
    (hasSplits && splittable > 0n) ||
    toRA > 0n ||
    bondDelta !== 0n
  );
};

export const ClaimBondAside: FC = () => {
  const hasRows = useHasRows();
  return (
    <div data-testid="claimBondFormInfo">
      <SubmitAside rows={hasRows ? <InfoRows /> : undefined}>
        <ClaimSubmitButton />
      </SubmitAside>
    </div>
  );
};
