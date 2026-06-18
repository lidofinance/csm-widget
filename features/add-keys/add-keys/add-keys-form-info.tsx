import { DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useModule } from 'modules/web3';
import { useWatch } from 'react-hook-form';
import { AddKeysFormInputType, useAddKeysFormData } from './context';

export const AddKeysFormInfo = () => {
  const [depositData] = useWatch<AddKeysFormInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { shareLimit } = useAddKeysFormData(true);
  const { isCM } = useModule();

  return (
    <DataTable data-testid="submitKeysFormInfo">
      {!isCM && (
        <>
          <DataTableRow title="Number of keys">
            {depositData.length}
          </DataTableRow>
          <Divider />

          <DataTableRow
            title="Deposit queue"
            help="The number of validators in the CSM deposit queue at the moment"
          >
            {shareLimit?.queue.toString()}
          </DataTableRow>
        </>
      )}
    </DataTable>
  );
};
