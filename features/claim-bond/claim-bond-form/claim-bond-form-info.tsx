import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useBondWillReceive } from 'shared/hooks';
import {
  CLAIM_OPTION,
  ClaimBondFormInputType,
  optionIncludesRewards,
  useClaimBondFormData,
} from './context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { useInsufficientBondCoverAmount } from './hooks/use-insufficient-bond-cover-amount';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress, rewards } = useClaimBondFormData(true);
  const [token, amount, claimOption] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimOption']
  >({
    name: ['token', 'amount', 'claimOption'],
  });

  const includesRewards = optionIncludesRewards(claimOption);
  const [bondReceive] = useBondWillReceive(
    token,
    amount,
    includesRewards ? rewards?.available : undefined,
  );
  const coverAmount = useInsufficientBondCoverAmount();

  const showRAReceive =
    claimOption !== CLAIM_OPTION.REWARDS_TO_BOND &&
    claimOption !== CLAIM_OPTION.COMPENSATE;
  const showBondIncrease =
    includesRewards && claimOption !== CLAIM_OPTION.COMPENSATE;

  return (
    <DataTable data-testid="claimBondFormInfo">
      {!!coverAmount && (
        <DataTableRow title="Compensation for the Insufficient Bond">
          <FormatToken amount={coverAmount} token={TOKENS.steth} />
        </DataTableRow>
      )}
      {showRAReceive && (
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
          <FormatToken amount={amount ?? 0n} token={token} />
        </DataTableRow>
      )}
      {showBondIncrease && bondReceive > 0n && (
        <DataTableRow title="Excess bond will increase by">
          <FormatToken amount={bondReceive} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
