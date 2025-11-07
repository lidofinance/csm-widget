import { AddressInputHookForm } from 'shared/hook-form/controls';
import { SubmitKeysFormInputType, useSubmitKeysFormData } from '../context';
import { useWatch } from 'react-hook-form';
import { OwnerChip } from 'shared/components';

export const ManagerAddressInput: React.FC = () => {
  const { address } = useSubmitKeysFormData(true);

  const extendedManagerPermissions = useWatch<
    SubmitKeysFormInputType,
    'extendedManagerPermissions'
  >({ name: 'extendedManagerPermissions' });

  return (
    <AddressInputHookForm
      fieldName="managerAddress"
      label={<>Manager Address {extendedManagerPermissions && <OwnerChip />}</>}
      currentAddress={address}
    />
  );
};
