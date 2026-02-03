import { type FC } from 'react';
import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useCuratedOperatorFormData } from '../context';

export const RewardAddressInput: FC = () => {
  const { address } = useCuratedOperatorFormData(true);
  return (
    <AddressInputHookForm
      fieldName="rewardAddress"
      label="Reward Address"
      currentAddress={address}
    />
  );
};
