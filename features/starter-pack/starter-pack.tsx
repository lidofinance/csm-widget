import { TryCSM } from 'features/welcome/try-csm';
import { FC } from 'react';
import { Faq } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { useCsmPaused, useCsmPublicRelease } from 'shared/hooks/useCsmStatus';
import { ConsumedBanner } from './consumed-banner';
import { NotEligibleBanner } from './not-eligible-banner/not-eligible-banner';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: paused } = useCsmPaused();
  const { data: isPublicRelease } = useCsmPublicRelease();
  const { data: ea } = useCsmEarlyAdoption();

  let content = <StarterPackSection />;

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
      {content}
      <TryCSM />
      <Faq />
    </>
  );
};
