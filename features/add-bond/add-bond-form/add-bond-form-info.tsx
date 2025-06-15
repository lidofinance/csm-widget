import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { ONE_ETH } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { useExchangeRate } from 'shared/hooks';
import { AddBondFormInputType } from './context';
import { useReceiveAmount } from './hooks/use-receive-amount';

export const AddBondFormInfo = () => {
  const [token, bondAmount] = useWatch<
    AddBondFormInputType,
    ['token', 'bondAmount']
  >({
    name: ['token', 'bondAmount'],
  });

  const receive = useReceiveAmount(bondAmount, token);
  const { data: exchange, isPending: isExchangeLoading } = useExchangeRate();

  return (
    <DataTable>
      <DataTableRow title="Bond balance will receive" loading={receive.loading}>
        <FormatToken amount={receive.amount} token={TOKENS.steth} />
      </DataTableRow>
      {token !== TOKENS.steth && (
        <DataTableRow title="Exchange rate" loading={isExchangeLoading}>
          <FormatToken amount={ONE_ETH} token={token} /> ={' '}
          <FormatToken amount={exchange?.[token]} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
