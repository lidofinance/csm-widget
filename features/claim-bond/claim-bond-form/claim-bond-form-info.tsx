import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { Address } from 'shared/components';
import { FormatToken } from 'shared/formatters';
import { useBondWillReceive } from 'shared/hooks';
import { ClaimBondFormInputType, useClaimBondFormData } from './context';
import { TOKENS } from '@lidofinance/lido-csm-sdk/common';

export const ClaimBondFormInfo = () => {
  const { rewardsAddress, rewards } = useClaimBondFormData();
  const [token, amount, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const [bondReceive] = useBondWillReceive(
    token,
    amount,
    claimRewards ? rewards?.available : undefined,
  );

  return (
    <DataTable>
      <DataTableRow
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
        help="The recipient of the claim is the Rewards address. You can change the Rewards address on the Roles tab"
      >
        <FormatToken amount={amount ?? 0n} token={token} />
      </DataTableRow>
      {claimRewards && (
        <DataTableRow title="Bond balance will increase by">
          <FormatToken amount={bondReceive} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
