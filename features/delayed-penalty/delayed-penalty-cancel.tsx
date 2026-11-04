import { useDelayedPenaltyModule } from 'modules/web3';
import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyCancelForm } from './delayed-penalty-cancel-form';

export const DelayedPenaltyCancel = () => {
  const key = useWeb3Key();
  const delayedPenaltyModule = useDelayedPenaltyModule();
  return <DelayedPenaltyCancelForm key={key} module={delayedPenaltyModule} />;
};
