import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { useUnlockBondFormData } from './context';
import { UnlockBondFormInputType } from './context/types';

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
        <FormatToken amount={lockedBond?.sub(amount ?? 0)} token={TOKENS.ETH} />
      </DataTableRow>
    </DataTable>
  );
};
