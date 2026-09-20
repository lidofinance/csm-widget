import { useDelayedPenaltyModule } from 'modules/web3';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyCancelForm } from './delayed-penalty-cancel-form';
import { LockedSection } from './locked-section';

export const DelayedPenaltyCancel = () => {
  const key = useWeb3Key();
  const delayedPenaltyModule = useDelayedPenaltyModule();
  return (
    <>
      <NoSSRWrapper>
        <DelayedPenaltyCancelForm key={key} module={delayedPenaltyModule} />
        <LockedSection key={`${key}_table`} module={delayedPenaltyModule} />
      </NoSSRWrapper>
    </>
  );
};
