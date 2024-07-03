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

  // TODO: state for `status.isUnavailable` (RPC error)
  return (
    <>
      {isWrongChain && <Fallback />}
      <WelcomeSection>
        <Stack>
          <Connect fullwidth>I am a Node Operator</Connect>
          <Connect fullwidth color="secondary">
            Become a Node Operator
          </Connect>
        </Stack>
      </WelcomeSection>
      {data?.isEarlyAdoption && <EarlyAdoptionBanner />}
    </>
  );
};
