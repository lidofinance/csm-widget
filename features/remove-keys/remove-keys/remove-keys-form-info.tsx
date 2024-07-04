import { DataTable, DataTableRow } from '@lidofinance/lido-ui';
import { useWatch } from 'react-hook-form';
import { RemoveKeysFormInputType } from './context/types';
import { FormatToken } from 'shared/formatters';
import { TOKENS } from 'consts/tokens';
import { useCsmKeyRemovalFee, useNodeOperatorBalance } from 'shared/hooks';
import { useMemo } from 'react';
import { useNodeOperatorId } from 'providers/node-operator-provider';

export const RemoveKeysFormInfo = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: removalFee, initialLoading: isFeeLoading } =
    useCsmKeyRemovalFee();
  const { data: balance, initialLoading: isBalanceLoading } =
    useNodeOperatorBalance(nodeOperatorId);

  const { count } = useWatch<RemoveKeysFormInputType, 'selection'>({
    name: 'selection',
  });
  const removalFeeTotal = useMemo(
    () => removalFee?.mul(count || 0),
    [count, removalFee],
  );
  const bondAfter = useMemo(
    () => balance?.current.sub(removalFeeTotal || 0),
    [balance, removalFeeTotal],
  );

  /**
   * TODO: excess/shortage bond after execution
   *
   * get nodeOperator's curve id
   * get nodeOperator's keysCount
   * get required bond amount for curve & keysCount
   * get bondDelta of (balance.current - fee, requiredByCurveAndKeys)
   */
  return (
    <DataTable>
      <DataTableRow title="Number of keys to remove">{count}</DataTableRow>
      <DataTableRow title="Removal fee" loading={isFeeLoading}>
        <FormatToken amount={removalFeeTotal} token={TOKENS.STETH} />
      </DataTableRow>
      <DataTableRow title="Bond after execution" loading={isBalanceLoading}>
        <FormatToken amount={bondAfter} token={TOKENS.STETH} />
      </DataTableRow>
    </DataTable>
  );
};
