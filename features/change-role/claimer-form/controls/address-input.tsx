import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const AddressInput: React.FC = () => {
  return (
    <>
      <FormTitle>Specify a new Rewards Claimer Address</FormTitle>
      <AddressInputHookForm
        fieldName="address"
        label="New Rewards Claimer Address"
      />
    </>
  );
};
