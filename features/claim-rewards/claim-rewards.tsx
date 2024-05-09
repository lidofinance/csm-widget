import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { ClaimRewardsForm } from './claim-rewards-form';

export const ClaimRewards = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <ClaimRewardsForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
