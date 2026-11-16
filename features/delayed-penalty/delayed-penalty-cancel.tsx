import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyCancelForm } from './delayed-penalty-cancel-form';
import { LockedSection } from './locked-section';

export const DelayedPenaltyCancel = () => {
  const key = useWeb3Key();
  return (
    <>
      <DelayedPenaltyCancelForm key={key} />
      <LockedSection key={`${key}_table`} />
    </>
  );
};
