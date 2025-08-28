import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { EjectKeysFormInputType, useEjectKeysFormData } from './context';
import { FormatToken } from 'shared/formatters';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const EjectKeysFormInfo = () => {
  const selection = useWatch<EjectKeysFormInputType, 'selection'>({
    name: 'selection',
  });
  const { ejectKeyFee } = useEjectKeysFormData();

  return (
    <DataTable>
      <DataTableRow title="Number of keys to eject">
        {selection.length}
      </DataTableRow>
      <DataTableRow title="Estimated ejection fee">
        <FormatToken amount={ejectKeyFee} token={TOKENS.eth} />
      </DataTableRow>
    </DataTable>
  );
};
