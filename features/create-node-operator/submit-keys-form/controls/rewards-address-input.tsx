import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useSubmitKeysFormData } from '../context';

export const RewardsAddressInput: React.FC = () => {
  const { address } = useSubmitKeysFormData(true);

  return (
    <AddressInputHookForm
      fieldName="rewardsAddress"
      label="Rewards Address"
      currentAddress={address}
    />
  );
};
