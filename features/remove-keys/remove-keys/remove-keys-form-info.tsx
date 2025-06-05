import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { TOKENS } from 'consts/tokens';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { useWatch } from 'react-hook-form';
import { FormatToken } from 'shared/formatters';
import { RemoveKeysFormInputType } from './context';
import { useBondBalanceAfterRemoveKeys } from './hooks/useBondBalanceAfterRemoveKeys';
import { useRemovalFeeByKeysCount } from './hooks/useRemovalFeeByKeysCount';

export const RemoveKeysFormInfo = () => {
  const { count } = useWatch<RemoveKeysFormInputType, 'selection'>({
    name: 'selection',
  });

  const nodeOperatorId = useNodeOperatorId();
  const { data: removalFee, initialLoading: isRemovalFeeLoading } =
    useRemovalFeeByKeysCount(count);
  const { data: balance, initialLoading: isBalanceLoading } =
    useBondBalanceAfterRemoveKeys(nodeOperatorId, count);

  return (
    <DataTable>
      <DataTableRow
        title="Number of keys to remove"
        data-testid="numbersOfKeysToRemove"
      >
        {count}
      </DataTableRow>
      <DataTableRow
        title="Removal fee"
        loading={isRemovalFeeLoading}
        help="Key deletion incurs a removal charge, deducted from the node operator's bond. This charge covers the maximum possible operational costs of queue processing"
        data-testid="removalFee"
      >
        <FormatToken amount={removalFee} token={TOKENS.STETH} />
      </DataTableRow>
      <DataTableRow
        title={`${balance?.isInsufficient ? 'Insufficient' : 'Excess'} bond after execution`}
        loading={isBalanceLoading}
        data-testid="excessBondAfterExecution"
      >
        <FormatToken amount={balance?.delta} token={TOKENS.STETH} />
      </DataTableRow>
    </DataTable>
  );
};
