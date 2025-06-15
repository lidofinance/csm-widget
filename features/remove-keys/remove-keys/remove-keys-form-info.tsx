import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { RemoveKeysFormInputType, useRemoveKeysFormData } from './context';
import { useBondBalanceAfterRemoveKeys } from './hooks/useBondBalanceAfterRemoveKeys';

export const RemoveKeysFormInfo = () => {
  const { removalFee } = useRemoveKeysFormData();
  const { count } = useWatch<RemoveKeysFormInputType, 'selection'>({
    name: 'selection',
  });

  const { data: balance, isPending: isBalanceLoading } =
    useBondBalanceAfterRemoveKeys(count);

  return (
    <DataTable>
      <DataTableRow title="Number of keys to remove">{count}</DataTableRow>
      <DataTableRow
        title="Removal fee"
        help="Key deletion incurs a removal charge, deducted from the node operator's bond. This charge covers the maximum possible operational costs of queue processing"
      >
        <FormatToken amount={removalFee} token={TOKENS.steth} />
      </DataTableRow>
      <DataTableRow
        title={`${balance?.isInsufficient ? 'Insufficient' : 'Excess'} bond after execution`}
        loading={isBalanceLoading}
      >
        <FormatToken amount={balance?.delta} token={TOKENS.steth} />
      </DataTableRow>
    </DataTable>
  );
};
