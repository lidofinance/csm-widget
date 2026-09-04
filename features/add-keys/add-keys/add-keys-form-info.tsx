import { DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { AddKeysFormInputType, useAddKeysFormData } from './context';
import { useModule } from 'modules/web3';

export const AddKeysFormInfo = () => {
  const { isCsmFamily } = useModule();
  const [depositData] = useWatch<AddKeysFormInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { shareLimit } = useAddKeysFormData(true);

  return (
    <DataTable data-testid="submitKeysFormInfo">
      {isCsmFamily && (
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
