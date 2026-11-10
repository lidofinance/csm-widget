import { InfoTooltip } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { TrailingInputStyle } from 'shared/hook-form/fields/styles';
import { VerifiedTag } from 'shared/node-operator/type-status';
import { useApplyFormData } from '../context';
import { ApplySection } from './apply-section';
import { MainAddressTooltipContent } from './main-address-tooltip-content';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData(true);

  return (
    <ApplySection
      title="Main address"
      subtitle={
        <>
          You are requesting IDVTC operator type for the following address:{' '}
          <InfoTooltip
            dataTestId={ICON_TOOLTIP_TEST_ID}
            content={<MainAddressTooltipContent />}
          />
        </>
      }
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
