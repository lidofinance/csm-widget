import { FC } from 'react';

import { Stack } from 'shared/components';
import { Fallback } from 'shared/hat/fallback/fallback';
import { useAccount } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { Connect } from 'shared/wallet';
import { EarlyAdoptionBanner } from './early-adoption-banner';
import { WelcomeSection } from './welcome-section';

export const Welcome: FC = () => {
  const { active, isConnected } = useAccount();
  const { data } = useCsmStatus();

  const isWrongChain = isConnected && !active;
  const isReleased = data?.isEarlyAdoption || data?.isPublicRelease;
  const isEarlyAdoption = data?.isEarlyAdoption && !data?.isPublicRelease;

  return (
    <>
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
