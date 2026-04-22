import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useBondWillReceive } from 'shared/hooks';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  useClaimBondFormData,
} from './context';
import { useInsufficientBondCoverAmount } from './hooks/use-insufficient-bond-cover-amount';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress, rewards } = useClaimBondFormData(true);
  const [token, amount, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimOption']
  >({
    name: ['token', 'amount', 'claimOption'],
  });

  const coverAmount = useInsufficientBondCoverAmount();
  const isRewardsToBond = claimOption === CLAIM_OPTION.REWARDS_TO_BOND;
  const includesRewards = claimOption !== CLAIM_OPTION.BOND_TO_RA;

  // Rewards remaining after covering an insufficient bond shortfall
  const rewardsAfterCover = includesRewards
    ? rewards.available - (coverAmount ?? 0n)
    : undefined;

  const [bondReceive] = useBondWillReceive(token, amount, rewardsAfterCover);

  const raAmount = isRewardsToBond ? 0n : (amount ?? 0n);

  return (
    <DataTable data-testid="claimBondFormInfo">
      {!isRewardsToBond && !!coverAmount && (
        <DataTableRow title="Compensation for the Insufficient Bond">
          <FormatToken amount={coverAmount} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {raAmount > 0n && (
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
          <FormatToken amount={raAmount} token={token} />
        </DataTableRow>
      )}
      {isRewardsToBond && (
        <DataTableRow title="Bond will receive">
          <FormatToken amount={rewards.available} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {!isRewardsToBond && bondReceive > 0n && (
        <DataTableRow title="Excess bond will increase by">
          <FormatToken amount={bondReceive} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
