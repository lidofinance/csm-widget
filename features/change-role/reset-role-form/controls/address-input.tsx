import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls/address-input-hook-form';

export const AddressInput: React.FC = () => {
  return (
    <>
      <FormTitle>Insert a new manager address</FormTitle>
      <AddressInputHookForm
        fieldName="address"
        label={`New manager address`}
        isLocked
      />
    </>
  );
};
