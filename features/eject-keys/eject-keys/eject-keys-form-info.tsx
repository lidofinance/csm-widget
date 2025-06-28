import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { EjectKeysFormInputType } from './context';

export const EjectKeysFormInfo = () => {
  const { count } = useWatch<EjectKeysFormInputType, 'selection'>({
    name: 'selection',
  });

  return (
    <DataTable>
      <DataTableRow title="Number of keys to eject">{count}</DataTableRow>
    </DataTable>
  );
};
