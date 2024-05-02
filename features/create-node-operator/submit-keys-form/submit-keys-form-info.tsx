import { useContractSWR } from '@lido-sdk/react';
import { DataTable, DataTableRow, Divider } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { useCSModuleRPC, useNodeOperatorQueue } from 'shared/hooks';
import { SubmitKeysFormInputType } from './context/types';

export const SubmitKeysFormInfo = () => {
  const contract = useCSModuleRPC();
  const operatorsCount = useContractSWR({
    contract,
    method: 'getActiveNodeOperatorsCount',
  });
  const [depositData] = useWatch<SubmitKeysFormInputType, ['depositData']>({
    name: ['depositData'],
  });

  const { data: queue } = useNodeOperatorQueue();

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys">{depositData.length}</DataTableRow>
      <Divider />
      <DataTableRow title="NodeOperators count">
        {operatorsCount.loading ? '...' : operatorsCount.data?.toString()}
      </DataTableRow>
      <DataTableRow title="Deposit queue">{queue?.[1].toString()}</DataTableRow>
    </DataTable>
  );

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys">{depositData.length}</DataTableRow>
      <Divider />
      <DataTableRow title="Deposit queue">{queue?.length}</DataTableRow>
    </DataTable>
  );
};
