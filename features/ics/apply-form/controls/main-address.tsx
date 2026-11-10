import { FC } from 'react';
import { TrailingInputStyle } from 'shared/hook-form/fields/styles';
import { VerifiedTag } from 'shared/node-operator/type-status';
import { useApplyFormData } from '../context';
import { ApplySection } from './apply-section';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData(true);

  return (
    <ApplySection
      title="Main address"
      subtitle="You are requesting ICS operator type for the following address:"
      data-testid="mainAddressSection"
    >
      <TrailingInputStyle
        $trailing
        name="mainAddress"
        aria-label="Main address"
        value={mainAddress}
        disabled
        icon={<VerifiedTag />}
      />
    </ApplySection>
  );
};
