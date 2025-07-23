import { useDappStatus } from 'modules/web3';
import { AddressInputHookForm } from 'shared/hook-form/controls';

export const RewardsAddressInput: React.FC = () => {
  const { address } = useDappStatus();

  return (
    <AddressInputHookForm
      fieldName="rewardsAddress"
      label="Rewards Address"
      currentAddress={address}
    />
  );
};
