import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { OneEther, TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { AddBondFormInputType } from './context/types';
import { useExchangeRate } from './hooks/use-exchange-rate';
import { useReceiveAmount } from './hooks/use-receive-amount';

export const AddBondFormInfo = () => {
  const [token, amount] = useWatch<AddBondFormInputType, ['token', 'amount']>({
    name: ['token', 'amount'],
  });

  const receive = useReceiveAmount(amount, token);
  const exchange = useExchangeRate(token);

  return (
    <DataTable>
      <DataTableRow title="Bond balance will receive" loading={receive.loading}>
        <FormatToken
          amount={receive.amount}
          token={TOKENS.STETH}
          trimEllipsis
        />
      </DataTableRow>
      {token !== TOKENS.STETH && (
        <DataTableRow title="Exchange rate" loading={exchange.loading}>
          <FormatToken amount={OneEther} token={token} /> ={' '}
          <FormatToken amount={exchange.rate} token={TOKENS.STETH} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
