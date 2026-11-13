import { DataListRow, Skeleton, Typography } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { CSSProperties, FC } from 'react';
import { useWatch } from 'react-hook-form';
import { GasCostRow, SubmitAside, SubmitButton } from 'shared/form-page';
import { FormatToken } from 'shared/formatters';
import { RemoveKeysFormInputType, useRemoveKeysFormData } from './context';
import { useBondBalanceAfterRemoveKeys } from './hooks/use-bond-balance-after-remove-keys';
import {
  getBondAfterRow,
  getRemovalFeeTotal,
  REMOVAL_FEE_TOOLTIP,
} from './remove-keys-state';

const INHERIT_FONT: CSSProperties = { font: 'inherit' };
const VALUE_SKELETON: CSSProperties = { width: 80 };

const useSelectedCount = () =>
  useWatch<RemoveKeysFormInputType, 'selection'>({ name: 'selection' }).count;

const RemovalFeeRow: FC = () => {
  const { removalFee } = useRemoveKeysFormData(true);
  const total = getRemovalFeeTotal(removalFee, useSelectedCount());

  if (total === undefined) return null;

  return (
    <DataListRow
      label="Removal fee"
      info={REMOVAL_FEE_TOOLTIP}
      value={<FormatToken amount={total} token={TOKENS.steth} />}
      description="Will be deducted from your bond balance"
      dataTestId={{ root: 'removalFee', value: 'removalFeeValue' }}
    />
  );
};

const KeysCountRow: FC = () => (
  <DataListRow
    label="Number of keys to remove"
    value={useSelectedCount()}
    dataTestId={{
      root: 'numbersOfKeysToRemove',
      value: 'numbersOfKeysToRemoveValue',
    }}
  />
);

const BondAfterRow: FC = () => {
  const { data: balance, isPending } =
    useBondBalanceAfterRemoveKeys(useSelectedCount());
  const row = getBondAfterRow(balance);
  const amount = <FormatToken amount={row.amount} token={TOKENS.steth} />;

  return (
    <DataListRow
      label={row.label}
      value={
        isPending ? (
          <Skeleton variant="text" style={VALUE_SKELETON} />
        ) : row.insufficient ? (
          <Typography as="span" color="error" style={INHERIT_FONT}>
            {amount}
          </Typography>
        ) : (
          amount
        )
      }
      dataTestId={{
        root: 'excessBondAfterExecution',
        value: 'excessBondAfterExecutionValue',
      }}
    />
  );
};

export const RemoveKeysAside: FC = () => (
  <SubmitAside
    rows={
      <>
        <RemovalFeeRow />
        <KeysCountRow />
        <GasCostRow />
        <BondAfterRow />
      </>
    }
  >
    <SubmitButton data-testid="removeKeysButton">Remove Keys</SubmitButton>
  </SubmitAside>
);
