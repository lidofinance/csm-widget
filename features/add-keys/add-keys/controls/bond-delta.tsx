import { DataList, DataListRow } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { getBondDeltaRow } from '../add-keys-state';
import { useAddKeysFormData } from '../context';
import { ErrorValueStyle } from '../styles';

const useBondDeltaRow = () => getBondDeltaRow(useAddKeysFormData(true).bond);

export const InsufficientBondRow: FC = () => {
  const row = useBondDeltaRow();

  if (!row?.insufficient) return null;

  return (
    <DataListRow
      label={row.label}
      description={row.hint}
      value={
        <ErrorValueStyle>
          <FormatToken amount={row.amount} token={TOKENS.steth} />
        </ErrorValueStyle>
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
