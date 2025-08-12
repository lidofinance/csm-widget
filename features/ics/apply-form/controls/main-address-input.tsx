import { FC } from 'react';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useApplyFormData } from '../context';

export const MainAddressInput: FC = () => {
  const { connectedAddress } = useApplyFormData();

  return (
    <AddressInputHookForm
      fieldName="mainAddress"
      label="Main address"
      isLocked
      disabled
      placeholder="Connect wallet to see address"
      currentAddress={connectedAddress}
    />
  );
};