import { DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { useNodeOperatorQueue } from 'shared/hooks';
import { AddKeysFormInputType } from './context/types';

export const AddKeysFormInfo = () => {
  const [depositData] = useWatch<AddKeysFormInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { data: queue } = useNodeOperatorQueue();

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys">{depositData.length}</DataTableRow>
      <Divider />
      <DataTableRow
        title="Deposit queue"
        help="The number of validators in the CSM deposit queue at the moment"
      >
        {queue?.toString()}
      </DataTableRow>
    </DataTable>
  );
};
