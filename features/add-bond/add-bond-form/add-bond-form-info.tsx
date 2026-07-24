import { convertSharesToEth, TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { ONE_ETH } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { AddBondFormInputType, useAddBondFormData } from './context';

export const AddBondFormInfo = () => {
  const { poolData } = useAddBondFormData(true);
  const [token, bondAmount] = useWatch<
    AddBondFormInputType,
    ['token', 'bondAmount']
  >({
    name: ['token', 'bondAmount'],
  });

  const toSteth = (amount: bigint) =>
    token === TOKENS.wsteth ? convertSharesToEth(amount, poolData) : amount;

  const receiveAmount = toSteth(bondAmount ?? 0n);
  const rate = toSteth(ONE_ETH);

  return (
    <DataTable data-testid="addBondTokenInfo">
      <DataTableRow
        title="Bond balance will receive"
        data-testid="balanceWillReceive"
      >
        <FormatToken amount={receiveAmount} token={TOKENS.steth} />
      </DataTableRow>
      {token !== TOKENS.steth && (
        <DataTableRow title="Exchange rate" data-testid="exchangeRate">
          <FormatToken amount={ONE_ETH} token={token} /> ={' '}
          <FormatToken amount={rate} token={TOKENS.steth} />
        </DataTableRow>
      )}
    </DataTable>
  );
};
