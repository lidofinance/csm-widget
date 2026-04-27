import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { ClaimBondFormInfoSplitters } from './claim-bond-form-info-splitters';
import { useClaimBondFormData } from './context';
import { useClaimBreakdown } from './hooks/use-claim-breakdown';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress, feeSplits } = useClaimBondFormData(true);
  const {
    coverAmount,
    splittable,
    toRA,
    bondDelta,
    debtBurned,
    debtRemain,
    includesRewards,
    hasSplits,
    isRewardsToBond,
  } = useClaimBreakdown();

  return (
    <DataTable data-testid="claimBondFormInfo">
      {includesRewards && coverAmount > 0n && (
        <DataTableRow title="Compensation for the Insufficient Bond">
          <FormatToken amount={coverAmount} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {includesRewards && debtBurned > 0n && (
        <DataTableRow
          title="Bond debt covered"
          help="Outstanding bond debt is automatically burned from the bond on every rewards distribution and deposit."
        >
          <FormatToken amount={debtBurned} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {debtRemain > 0n && (
        <DataTableRow
          title="Bond debt remaining"
          help="Bond debt that cannot be covered yet — it will be paid down by future rewards or deposits."
        >
          <FormatToken amount={debtRemain} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {hasSplits && splittable > 0n && (
        <ClaimBondFormInfoSplitters feeSplits={feeSplits} amount={splittable} />
      )}
      {toRA > 0n && (
        <DataTableRow
          data-testid="claimBondFormInfoTitle"
          title={
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
          help="The recipient of the claim is the Rewards Address. You can change the Rewards Address on the Settings tab"
        >
          <FormatToken amount={toRA} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {bondDelta > 0n && (
        <DataTableRow
          title={
            isRewardsToBond
              ? 'Bond will receive'
              : 'Excess bond will increase by'
          }
        >
          <FormatToken amount={bondDelta} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {bondDelta < 0n && (
        <DataTableRow title="Excess bond will decrease by">
          <FormatToken amount={-bondDelta} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
