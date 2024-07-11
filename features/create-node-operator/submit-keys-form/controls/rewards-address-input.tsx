import { FormTitle } from 'shared/components';
import { AddressInputHookForm } from 'shared/hook-form/controls/address-input-hook-form';

export const RewardsAddressInput: React.FC = () => {
  return (
    <>
      <FormTitle>Insert rewards address</FormTitle>
      <AddressInputHookForm
        fieldName="rewardsAddress"
        label={`Rewards address`}
      />
    </>
  );
};
