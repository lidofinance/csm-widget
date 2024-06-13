import { FC } from 'react';

import { Fallback } from 'shared/hat/fallback/fallback';
import { useAccount } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { Connect } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { NotReleasedBanner } from './not-released-banner';
import { WelcomeSection } from './welcome-section';
import { Wrapper } from './welcome-section/styles';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data } = useCsmStatus();

  const isWrongChain = isConnected && !active;
  const isNotReleased = data && !data?.isReleased;
  const isReleased = data && data.isReleased;
  const isEarlyAdoption =
    isReleased && data.isEarlyAdoption && !data.isPublicRelease;

  return (
    <Wrapper>
      {isNotReleased && <NotReleasedBanner />}
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        {isEarlyAdoption ? (
          <>
            <EarlyAdoptionBanner />
            <Connect fullwidth />
          </>
        ) : isReleased ? (
          <Connect fullwidth />
        ) : null}
      </WelcomeSection>
    </Wrapper>
  );
};
