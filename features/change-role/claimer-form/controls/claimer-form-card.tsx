import { FC } from 'react';
import { FormCard, SubmitButton } from 'shared/form-page';
import { AddressField } from 'shared/hook-form/fields';

export const ClaimerFormCard: FC = () => (
  <FormCard title="Specify a new Rewards Claimer Address">
    <AddressField name="address" label="New Rewards Claimer Address" />
    <SubmitButton disableIfClean>Set new Rewards Claimer Address</SubmitButton>
  </FormCard>
);
