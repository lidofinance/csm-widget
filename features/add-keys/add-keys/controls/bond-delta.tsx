import { DataListRow, Typography } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { getBondDeltaRow } from '../add-keys-state';
import { useAddKeysFormData } from '../context';

const INHERIT_FONT = { font: 'inherit' };

export const BondDeltaAsideRow: FC = () => {
  const row = getBondDeltaRow(useAddKeysFormData(true).bond);

  if (!row) return null;

  const amount = <FormatToken amount={row.amount} token={TOKENS.steth} />;

  return (
    <DataListRow
      label={row.label}
      description={row.hint}
      value={
        row.insufficient ? (
          <Typography as="span" color="error" style={INHERIT_FONT}>
            {amount}
          </Typography>
        ) : (
          amount
        )
      }
    />
  );
};
