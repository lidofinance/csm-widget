import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { ONE_ETH, TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { AddBondFormInputType } from './context';
import { useReceiveAmount } from './hooks/use-receive-amount';
import { useExchangeRate } from 'shared/hooks';

export const AddBondFormInfo = () => {
  const [token, bondAmount] = useWatch<
    AddBondFormInputType,
    ['token', 'bondAmount']
  >({
    name: ['token', 'bondAmount'],
  });

  const receive = useReceiveAmount(bondAmount, token);
  const exchange = useExchangeRate(token);

  return (
    <DataTable>
      <DataTableRow title="Bond balance will receive" loading={receive.loading}>
        <FormatToken amount={receive.amount} token={TOKENS.STETH} />
      </DataTableRow>
      {token !== TOKENS.STETH && (
        <DataTableRow title="Exchange rate" loading={exchange.loading}>
          <FormatToken amount={ONE_ETH} token={token} /> ={' '}
          <FormatToken amount={exchange.rate} token={TOKENS.STETH} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
