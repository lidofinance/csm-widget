import { DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { SubmitKeysFormInputType, useSubmitKeysFormData } from './context';

export const SubmitKeysFormInfo = () => {
  const [depositData] = useWatch<SubmitKeysFormInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { shareLimit } = useSubmitKeysFormData();

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys">{depositData.length}</DataTableRow>
      <Divider />
      <DataTableRow
        loading={!shareLimit}
        title="Deposit queue"
        help="The number of validators in the CSM deposit queue at the moment"
      >
        {shareLimit?.queue.toString()}
      </DataTableRow>
    </DataTable>
  );
};
