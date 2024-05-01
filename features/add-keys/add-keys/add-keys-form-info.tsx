import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { getTokenDisplayName } from 'utils/getTokenDisplayName';
import { useAddKeysFormData } from './context/add-keys-form-context';
import { AddKeysFormInputType } from './context/types';

export const AddKeysFormInfo = () => {
  const parsedKeys = useWatch<AddKeysFormInputType, 'parsedKeys'>({
    name: 'parsedKeys',
  });
  const token = useWatch<AddKeysFormInputType, 'token'>({
    name: 'token',
  });
  const { bondAmount } = useAddKeysFormData();

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
    </DataTable>
  );
};
