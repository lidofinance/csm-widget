import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { UnlockBondFormInputType, useUnlockBondFormData } from './context';

export const UnlockBondFormInfo = () => {
  const { lockedBond } = useUnlockBondFormData(true);

  const amount = useWatch<UnlockBondFormInputType, 'amount'>({
    name: 'amount',
  });

  const remainLockedBond = lockedBond - (amount ?? 0n);

  return (
    <DataTable>
      <DataTableRow title="Remaining locked bond">
        <FormatToken amount={remainLockedBond} token={TOKENS.eth} />
      </DataTableRow>
    </DataTable>
  );
};
