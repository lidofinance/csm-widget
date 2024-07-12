import { FC } from 'react';

import { Stack } from 'shared/components';
import { useAccount } from 'shared/hooks';
import { useCsmStatus } from 'shared/hooks/useCsmStatus';
import { Connect, Fallback } from 'shared/wallet';
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
        <Stack wrap>
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
