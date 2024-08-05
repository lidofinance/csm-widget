import { Button } from '@lidofinance/lido-ui';
import { PATH } from 'consts/urls';
import { FC, useCallback } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { useNavigate } from 'shared/navigate';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';
import { trackMatomoEvent } from 'utils';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const StarterPack: FC = () => {
  const navigate = useNavigate();

  const { data: status } = useCsmStatus();
  const { data: ea } = useCsmEarlyAdoption();

  const handleClick = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.starterPackCreateNodeOperator);
    void navigate(PATH.KEYS);
  }, [navigate]);

  if (status?.isPaused) {
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
        <Button onClick={handleClick}>Create Node Operator</Button>
      </StarterPackSection>
      <Faq />
    </>
  );
};
