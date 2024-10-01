import { Button } from '@lidofinance/lido-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { PATH } from 'consts/urls';
import Link from 'next/link';
import { FC, useCallback } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { trackMatomoEvent } from 'utils';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: status } = useCsmStatus();
  const { data: ea } = useCsmEarlyAdoption();

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator);
  }, []);

  if (status?.isPaused || status?.isAccountingPaused) {
    return <PausedBanner />;
  }

  if (status?.isEarlyAdoption && ea?.consumed) {
    return <ConsumedBanner />;
  }

  if (status?.isEarlyAdoption && !ea?.proof) {
    return <NotEligibleBanner />;
  }

  return (
    <>
      <StarterPackSection>
        <Link href={PATH.KEYS_SUBMIT} passHref legacyBehavior>
          <Button onClick={handleClick}>Create Node Operator</Button>
        </Link>
      </StarterPackSection>
      <Faq />
    </>
  );
};
