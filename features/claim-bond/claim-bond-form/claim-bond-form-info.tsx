import { Zero } from '@ethersproject/constants';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { ClaimBondFormInputType } from './context';
import { useBondReceiveAmount } from './hooks/use-bond-receive-amount';

export const ClaimBondFormInfo = () => {
  const [token, amount, claimRewards] = useWatch<
    ClaimBondFormInputType,
    ['token', 'amount', 'claimRewards']
  >({
    name: ['token', 'amount', 'claimRewards'],
  });

  const bondReceive = useBondReceiveAmount();

  return (
    <DataTable>
      <DataTableRow title="Rewards Address will receive">
        <FormatToken amount={amount ?? Zero} token={token} />
      </DataTableRow>
      {claimRewards && (
        <DataTableRow title="Bond balance will increase by">
          <FormatToken amount={bondReceive} token={TOKENS.STETH} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
