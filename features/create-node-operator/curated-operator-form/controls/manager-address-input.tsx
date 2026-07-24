import { type FC } from 'react';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useCuratedOperatorFormData } from '../context';
import { OwnerChip } from 'shared/components';

export const ManagerAddressInput: FC = () => {
  const { address } = useCuratedOperatorFormData(true);
  return (
    <AddressInputHookForm
      fieldName="managerAddress"
      label={
        <>
          Manager Address <OwnerChip />
        </>
      }
      currentAddress={address}
    />
  );
};
