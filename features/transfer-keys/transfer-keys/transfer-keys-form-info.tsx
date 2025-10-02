import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useTransferKeysFormData } from './context';

export const TransferKeysFormInfo = () => {
  const { keysToMigrate } = useTransferKeysFormData();

  return (
    <DataTable>
      <DataTableRow title="Number of keys to transfer">
        {keysToMigrate}
      </DataTableRow>
    </DataTable>
  );
};
