import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useSubmitKeysFormData } from '../context';

export const ManagerAddressInput: React.FC = () => {
  const { address } = useSubmitKeysFormData(true);

  return (
    <AddressInputHookForm
      fieldName="managerAddress"
      label="Manager Address"
      currentAddress={address}
    />
  );
};
