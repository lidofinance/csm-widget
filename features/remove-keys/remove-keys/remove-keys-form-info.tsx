import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { RemoveKeysFormInputType } from './context';
import { useBondBalanceAfterRemoveKeys } from './hooks/use-bond-balance-after-remove-keys';

export const RemoveKeysFormInfo = () => {
  const { count } = useWatch<RemoveKeysFormInputType, 'selection'>({
    name: 'selection',
  });

  const { data: balance, isPending: isBalanceLoading } =
    useBondBalanceAfterRemoveKeys(count);

  return (
    <DataTable>
      <DataTableRow
        title="Number of keys to remove"
        data-testid="numbersOfKeysToRemove"
      >
        {count}
      </DataTableRow>
      <DataTableRow
        title={`${balance?.isInsufficient ? 'Insufficient' : 'Excess'} bond after execution`}
        loading={isBalanceLoading}
        data-testid="excessBondAfterExecution"
      >
        <FormatToken amount={balance?.delta} token={TOKENS.steth} />
      </DataTableRow>
    </DataTable>
  );
};
