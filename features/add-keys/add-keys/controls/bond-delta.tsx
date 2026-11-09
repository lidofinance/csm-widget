import { DataList, DataListRow, Typography } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { getBondDeltaRow } from '../add-keys-state';
import { useAddKeysFormData } from '../context';

const INHERIT_FONT = { font: 'inherit' };

const useBondDeltaRow = () => getBondDeltaRow(useAddKeysFormData(true).bond);

export const InsufficientBondRow: FC = () => {
  const row = useBondDeltaRow();

  if (!row?.insufficient) return null;

  return (
    <DataListRow
      label={row.label}
      description={row.hint}
      value={
        <Typography as="span" color="error" style={INHERIT_FONT}>
          <FormatToken amount={row.amount} token={TOKENS.steth} />
        </Typography>
      }
    />
  );
};

export const ExcessBondRow: FC = () => {
  const row = useBondDeltaRow();

  if (!row || row.insufficient) return null;

  return (
    <DataList>
      <DataListRow
        label={row.label}
        description={row.hint}
        value={<FormatToken amount={row.amount} token={TOKENS.steth} />}
      />
    </DataList>
  );
};
