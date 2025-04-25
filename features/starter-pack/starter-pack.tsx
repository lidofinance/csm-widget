import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { TryCSM } from 'features/welcome/try-csm';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useCsmPaused } from 'shared/hooks/useCsmStatus';
import { LocalLink } from 'shared/navigate';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: paused } = useCsmPaused();

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
