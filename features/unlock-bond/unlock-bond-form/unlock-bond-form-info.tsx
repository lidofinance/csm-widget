import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { FormatToken } from 'shared/formatters';
import { useUnlockBondFormData } from './context';

export const UnlockBondFormInfo = () => {
  const { compensationAmount, bond } = useUnlockBondFormData(true);

  if (!compensationAmount) return null;

  const remainingLocked = bond.locked - compensationAmount;

  return (
    <DataTable>
      <DataTableRow title="Remaining locked bond">
        <FormatToken amount={remainingLocked} token={TOKENS.steth} />
      </DataTableRow>
    </DataTable>
  );
};
