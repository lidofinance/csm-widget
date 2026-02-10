import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const AddressInput: React.FC = () => {
  return (
    <>
      <FormTitle>Specify a new Rewards claimer address</FormTitle>
      <AddressInputHookForm
        fieldName="address"
        label="New Rewards claimer address"
      />
    </>
  );
};
