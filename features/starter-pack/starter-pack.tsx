import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import { TryCSM } from 'features/welcome/try-csm';
import Link from 'next/link';
import { FC, useCallback } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmPaused, useCsmPublicRelease } from 'shared/hooks/useCsmStatus';
import { trackMatomoEvent } from 'utils';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: paused } = useCsmPaused();
  const { data: isPublicRelease } = useCsmPublicRelease();
  const { data: ea } = useCsmEarlyAdoption();

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator);
  }, []);

  let content = (
    <StarterPackSection>
      <Link href={PATH.CREATE} passHref legacyBehavior>
        <Button onClick={handleClick}>Create Node Operator</Button>
      </Link>
    </StarterPackSection>
  );

  if (paused?.isPaused || paused?.isAccountingPaused) {
    content = <PausedBanner />;
  }

  if (!isPublicRelease && ea?.consumed) {
    content = <ConsumedBanner />;
  }

  if (!isPublicRelease && !ea?.proof) {
    content = <NotEligibleBanner />;
  }

  return (
    <>
      {content}
      <TryCSM />
      <Faq />
    </>
  );
};
