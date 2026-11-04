import { DataList, DataListRow } from '@lidofinance/lido-app-ui';
import { TOKENS } from '@lidofinance/lido-csm-sdk';
import { FC } from 'react';
import { FormatToken } from 'shared/formatters';
import { getAddBondDeltaRow } from '../add-bond-state';
import { useAddBondFormData } from '../context';
import { ErrorValueStyle } from '../styles';

const DELTA_TEST_ID = { root: 'titledAmount', value: 'titledAmountBalance' };

const useDeltaRow = () => getAddBondDeltaRow(useAddBondFormData(true).bond);

export const InsufficientBondRow: FC = () => {
  const row = useDeltaRow();

  if (!row?.insufficient) return null;

  return (
    <DataListRow
      label={row.label}
      info={row.info}
      value={
        <ErrorValueStyle>
          <FormatToken amount={row.amount} token={TOKENS.steth} />
        </ErrorValueStyle>
      }
      dataTestId={DELTA_TEST_ID}
    />
  );
};

export const ExcessBondRow: FC = () => {
  const row = useDeltaRow();

  if (!row || row.insufficient) return null;

  return (
    <DataList>
      <DataListRow
        label={row.label}
        value={<FormatToken amount={row.amount} token={TOKENS.steth} />}
        dataTestId={DELTA_TEST_ID}
      />
    </DataList>
  );
};
