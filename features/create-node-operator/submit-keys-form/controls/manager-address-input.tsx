import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useAccount } from 'shared/hooks';

export const ManagerAddressInput: React.FC = () => {
  const { address } = useAccount();

  return (
    <AddressInputHookForm
      fieldName="managerAddress"
      label="Manager address"
      currentAddress={address}
    />
  );
};
