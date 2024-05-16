import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { RemoveKeysFormInputType } from './context/types';
import { FormatToken } from 'shared/formatters';
import { TOKENS } from 'consts/tokens';
import { useCsmKeyRemovalFee } from 'shared/hooks';
import { useMemo } from 'react';

export const RemoveKeysFormInfo = () => {
  const count = useWatch<RemoveKeysFormInputType, 'count'>({
    name: 'count',
  });
  const { data: removalFee, initialLoading } = useCsmKeyRemovalFee();
  const removalFeeTotal = useMemo(() => {
    return removalFee?.mul(count || 0);
  }, [count, removalFee]);

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys to remove">{count}</DataTableRow>
      <DataTableRow title="Removing Fee" loading={initialLoading}>
        <FormatToken amount={removalFeeTotal} symbol={TOKENS.STETH} />
      </DataTableRow>
    </DataTable>
  );
};
