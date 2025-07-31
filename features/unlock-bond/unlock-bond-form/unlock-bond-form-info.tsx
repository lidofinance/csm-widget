import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { UnlockBondFormInputType, useUnlockBondFormData } from './context';
import { TOKENS } from '@lidofinance/lido-csm-sdk';

export const UnlockBondFormInfo = () => {
  const {
    lockedBond,
    loading: { isLockedBondLoading },
  } = useUnlockBondFormData();

  const amount = useWatch<UnlockBondFormInputType, 'amount'>({
    name: 'amount',
  });

  return (
    <DataTable>
      <DataTableRow title="Remaining locked bond" loading={isLockedBondLoading}>
        <FormatToken
          amount={(lockedBond ?? 0n) - (amount ?? 0n)}
          token={TOKENS.eth}
        />
      </DataTableRow>
    </DataTable>
  );
};
