import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls/address-input-hook-form';

export const ManagerAddressInput: React.FC = () => {
  return (
    <>
      <FormTitle>Insert manager address</FormTitle>
      <AddressInputHookForm
        fieldName="managerAddress"
        label={`Manager address`}
      />
    </>
  );
};
