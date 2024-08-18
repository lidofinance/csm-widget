import { AddressInputHookForm } from 'shared/hook-form/controls';
import { useAccount } from 'shared/hooks';

export const RewardsAddressInput: React.FC = () => {
  const { address } = useAccount();

  return (
    <AddressInputHookForm
      fieldName="rewardsAddress"
      label="Rewards address"
      currentAddress={address}
    />
  );
};
