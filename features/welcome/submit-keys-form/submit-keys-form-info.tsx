import { useContractSWR } from '@lido-sdk/react';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { useCSModuleRPC } from 'shared/hooks';
import { SubmitKeysFormInputType } from './context/types';
import { useSubmitKeysFormData } from './context/submit-keys-form-context';
import { FormatToken } from 'shared/formatters';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';

export const SubmitKeysFormInfo = () => {
  const contract = useCSModuleRPC();
  const operatorsCount = useContractSWR({
    contract,
    method: 'getActiveNodeOperatorsCount',
  });
  const parsedKeys = useWatch<SubmitKeysFormInputType, 'parsedKeys'>({
    name: 'parsedKeys',
  });
  const token = useWatch<SubmitKeysFormInputType, 'token'>({
    name: 'token',
  });
  const { bondAmount } = useSubmitKeysFormData();

  return (
    <DataTable data-testid="submitKeysFormInfo">
      <DataTableRow title="Number of keys">{parsedKeys.length}</DataTableRow>
      <DataTableRow title="Bond">
        <FormatToken
          showAmountTip={false}
          amount={bondAmount}
          symbol={getTokenDisplayName(token)}
        />
      </DataTableRow>
      <DataTableRow title="Number of NO">
        {operatorsCount.loading ? '...' : operatorsCount.data?.toString()}
      </DataTableRow>
    </DataTable>
  );
};
