import {
  Button,
  DataList,
  DataListRow,
  SectionTitle,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRoot,
  TableRow,
} from '@lidofinance/lido-app-ui';
import type { CurveParameters } from '@lidofinance/lido-csm-sdk';
import { FC, useState } from 'react';
import { CLAIM_SUMMARY_ROWS } from './claim-summary-rows';
import { getClaimTypeSummary } from './claim-type-summary';
import { ParameterChangesModal } from './parameter-changes-modal';
import { ChangesBoxStyle } from './styles';

export type ClaimChangesVariant = 'change' | 'compare';

export type ClaimChangesProps = {
  title: string;
  from?: CurveParameters;
  to?: CurveParameters;
  fromLabel: string;
  toLabel: string;
  variant?: ClaimChangesVariant;
  'data-testid'?: string;
};

export const ClaimChanges: FC<ClaimChangesProps> = ({
  title,
  from,
  to,
  fromLabel,
  toLabel,
  variant = 'change',
  'data-testid': dataTestId = 'claimChanges',
}) => {
  const [open, setOpen] = useState(false);
  const fromSummary = getClaimTypeSummary(from);
  const toSummary = getClaimTypeSummary(to);

  return (
    <ChangesBoxStyle data-testid={dataTestId}>
      <SectionTitle
        title={title}
        action={
          <Button
            variant="outline"
            size="small"
            onClick={() => setOpen(true)}
            dataTestId={{ root: 'viewFullListButton' }}
          >
            View full list
          </Button>
        }
      />
      {variant === 'change' ? (
        <DataList divided>
          {CLAIM_SUMMARY_ROWS.map(({ label, render }) => (
            <DataListRow
              key={label}
              label={label}
              value={{ from: render(fromSummary), to: render(toSummary) }}
            />
          ))}
        </DataList>
      ) : (
        <TableRoot variant="dense">
          <TableHead>
            <TableRow>
              <TableHeaderCell />
              <TableHeaderCell>{fromLabel}</TableHeaderCell>
              <TableHeaderCell>{toLabel}</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {CLAIM_SUMMARY_ROWS.map(({ label, render }) => (
              <TableRow key={label}>
                <TableCell>{label}</TableCell>
                <TableCell>{render(fromSummary)}</TableCell>
                <TableCell>{render(toSummary)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </TableRoot>
      )}
      <ParameterChangesModal
        open={open}
        onClose={() => setOpen(false)}
        items={[
          { parameters: from, title: fromLabel },
          { parameters: to, title: toLabel },
        ]}
      />
    </ChangesBoxStyle>
  );
};
