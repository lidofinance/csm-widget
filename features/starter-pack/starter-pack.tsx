import { TryCSM } from 'features/welcome/try-csm';
import { useCsmStatus } from 'modules/web3';
import { FC } from 'react';
import { BannerOperatorCustomAddresses } from './banner-operator-custom-addresses';
import { CreateOperatorButton } from './create-operator-button';
import { PausedBanner } from './paused-banner';
import { StarterPackSection } from './stacter-pack-section';

export const StarterPack: FC = () => {
  const { data: status } = useCsmStatus();

  let content = (
    <StarterPackSection>
      <CreateOperatorButton />
    </StarterPackSection>
  );

  if (status?.isPaused) {
    content = <PausedBanner />;
  }

  return (
    <>
      <BannerOperatorCustomAddresses />
      {content}
      <TryCSM />
    </>
  );
};
