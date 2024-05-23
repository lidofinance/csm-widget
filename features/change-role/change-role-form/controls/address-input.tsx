import { AddressZero } from '@ethersproject/constants';
import { useMemo } from 'react';
import { AddressInputHookForm } from 'shared/hook-form/controls/address-input-hook-form';
import { useChangeRoleFormData } from '../context';

export const AddressInput: React.FC = () => {
  const { proposedAddress } = useChangeRoleFormData();
  const isProposedAddress = useMemo(
    () => proposedAddress !== AddressZero,
    [proposedAddress],
  );

  return (
    <AddressInputHookForm
      fieldName="address"
      label="New Address"
      revoke={isProposedAddress}
    />
  );
};
