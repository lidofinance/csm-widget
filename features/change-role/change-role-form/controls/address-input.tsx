import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useRole } from '../hooks/use-role';
import { useChangeRoleFlow, useChangeRoleFormData } from '../context';
import { isAddressEqual } from 'viem';

export const AddressInput: React.FC = () => {
  const flow = useChangeRoleFlow();
  const { address, currentAddress } = useChangeRoleFormData(true);
  const role = useRole();

  return (
    <>
      <FormTitle>Specify a new {role} Address</FormTitle>
      <AddressInputHookForm
        fieldName="address"
        label={`New ${role} Address`}
        isLocked={flow.action === 'manager-reset'}
        currentAddress={
          isAddressEqual(currentAddress, address) ? undefined : address
        }
      />
    </>
  );
};
