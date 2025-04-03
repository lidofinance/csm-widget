import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { TryCSM } from 'features/welcome/try-csm';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmPaused, useCsmPublicRelease } from 'shared/hooks/useCsmStatus';
import { LocalLink } from 'shared/navigate';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: paused } = useCsmPaused();
  const { data: isPublicRelease } = useCsmPublicRelease();
  const { data: ea } = useCsmEarlyAdoption();

  let content = (
    <StarterPackSection>
      <LocalLink
        href={PATH.CREATE}
        matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator}
      >
        <Button fullwidth>Create Node Operator</Button>
      </LocalLink>
    </StarterPackSection>
  );

  if (!isPublicRelease && ea?.consumed) {
    content = <ConsumedBanner />;
  }

  if (!isPublicRelease && !ea?.proof) {
    content = <NotEligibleBanner />;
  }

  if (paused?.isPaused || paused?.isAccountingPaused) {
    content = <PausedBanner />;
  }

  return (
    <>
      <BannerOperatorCustomAddresses />
      {content}
      <TryCSM />
      <Faq />
    </>
  );
};
