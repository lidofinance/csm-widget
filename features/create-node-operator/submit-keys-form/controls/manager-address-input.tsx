import { useDappStatus } from 'modules/web3';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const ManagerAddressInput: React.FC = () => {
  const { address } = useDappStatus();

  return (
    <AddressInputHookForm
      fieldName="managerAddress"
      label="Manager Address"
      currentAddress={address}
    />
  );
};
