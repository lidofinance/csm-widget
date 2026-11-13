import { FC } from 'react';
import { GasCostRow, SubmitAside, SubmitButton } from 'shared/form-page';

export const DelayedPenaltyReportAside: FC = () => (
  <SubmitAside rows={<GasCostRow />}>
    <SubmitButton>Report delayed penalty</SubmitButton>
  </SubmitAside>
);
