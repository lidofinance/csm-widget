import { FC } from 'react';
import { GasCostRow, SubmitAside, SubmitButton } from 'shared/form-page';

export const DelayedPenaltyCancelAside: FC = () => (
  <SubmitAside rows={<GasCostRow />}>
    <SubmitButton>Cancel delayed penalty</SubmitButton>
  </SubmitAside>
);
