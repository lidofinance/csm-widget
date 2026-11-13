import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { OwnerChip } from 'shared/components';
import { AddressField } from 'shared/hook-form/fields';
import { SubmitKeysFormInputType, useSubmitKeysFormData } from '../context';

export const ManagerAddressInput: FC = () => {
  const { address } = useSubmitKeysFormData(true);
  const extendedManagerPermissions = useWatch<
    SubmitKeysFormInputType,
    'extendedManagerPermissions'
  >({ name: 'extendedManagerPermissions' });

  return (
    <AddressField
      name="managerAddress"
      label={<>Manager Address {extendedManagerPermissions && <OwnerChip />}</>}
      currentAddress={address}
    />
  );
};
