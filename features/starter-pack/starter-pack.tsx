import { Loader } from '@lidofinance/lido-ui';
import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { TryOtherNetwork } from 'features/welcome/try-other-network';
import { NavigateCMv1 } from 'features/welcome/navigate-cm-v1';
import { useDeployedModulesStatus } from 'modules/web3';
import { FC } from 'react';
import { Stack, WelcomeSection } from 'shared/components';
import { useCanCreateNodeOperator, useCreateOptions } from 'shared/hooks';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { CreateOperatorButton } from './create-operator-button';
import { BannerNotEligible } from './not-eligible/banner-not-eligible';
import { BannerTryCsm } from './not-eligible/banner-try-csm';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const options = useCreateOptions();
  const { isPending } = useCanCreateNodeOperator();
  const statuses = useDeployedModulesStatus();

  if (isPending || statuses.isPending)
    return (
      <WelcomeSection>
        <Stack align="center" justify="center">
          <Loader size="large" data-testid="loader" />
        </Stack>
      </WelcomeSection>
    );

  const content =
    options.length > 0 ? (
      <StarterPackSection>
        <CreateOperatorButton />
      </StarterPackSection>
    ) : statuses.allPaused ? (
      <PausedBanner />
    ) : (
      <>
        <BannerNotEligible />
        <BannerTryCsm />
        {deployedModules.includes(MODULE_NAME.CM) && <NavigateCMv1 />}
      </>
    );

  return (
    <>
      <BannerOperatorCustomAddresses />
      {content}
      <TryOtherNetwork />
    </>
  );
};
