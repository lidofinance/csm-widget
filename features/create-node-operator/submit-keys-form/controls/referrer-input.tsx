import { FC } from 'react';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const ReferrerInput: FC = () => (
  <AddressInputHookForm
    fieldName="referrer"
    label="Referrer address"
    disabled
  />
);
