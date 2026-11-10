import { InfoTooltip } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { ICON_TOOLTIP_TEST_ID } from 'shared/components/icon-tooltip/test-ids';
import { MainAddressSection } from 'shared/node-operator/type-apply';
import { useApplyFormData } from '../context';
import { MainAddressTooltipContent } from './main-address-tooltip-content';

export const MainAddress: FC = () => {
  const { mainAddress } = useApplyFormData(true);

  return (
    <MainAddressSection
      address={mainAddress}
      subtitle={
        <>
          You are requesting IDVTC operator type for the following address:{' '}
          <InfoTooltip
            dataTestId={ICON_TOOLTIP_TEST_ID}
            content={<MainAddressTooltipContent />}
          />
        </>
      }
    />
  );
};
