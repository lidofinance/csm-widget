import { FC } from 'react';
import { FormCard, GasCostList, SubmitButton } from 'shared/form-page';
import { AddressField } from 'shared/hook-form/fields';
import { CLAIMER_TOOLTIP } from '../claimer-state';

export const ClaimerFormCard: FC = () => (
  <FormCard
    title="Specify a new Rewards claimer address"
    tooltip={CLAIMER_TOOLTIP}
  >
    <AddressField name="address" label="New Rewards claimer address" />
    <GasCostList />
    <SubmitButton disableIfClean>Set new Rewards claimer address</SubmitButton>
  </FormCard>
);
