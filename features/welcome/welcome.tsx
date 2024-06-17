import { FC } from 'react';

import { Fallback } from 'shared/hat/fallback/fallback';
import { useAccount } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { Connect } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { NotReleasedBanner } from './not-released-banner';
import { WelcomeSection } from './welcome-section';
import { Stack } from 'shared/components';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data } = useCsmStatus();

  const isWrongChain = isConnected && !active;
  const isNotReleased = data && !data?.isReleased;
  const isReleased = data && data.isReleased;
  const isEarlyAdoption =
    isReleased && data.isEarlyAdoption && !data.isPublicRelease;

  return (
    <>
      {isNotReleased || <NotReleasedBanner />}
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        {isReleased && (
          <Stack>
            <Connect fullwidth>I am a Node Operator</Connect>
            <Connect fullwidth color="secondary">
              Become a Node Operator
            </Connect>
          </Stack>
        )}
      </WelcomeSection>
      {isEarlyAdoption && <EarlyAdoptionBanner />}
    </>
  );
};
