import { useDelayedPenaltyModule } from 'modules/web3';
import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyReportForm } from './delayed-penalty-report-form';

export const DelayedPenaltyReport = () => {
  const key = useWeb3Key();
  const delayedPenaltyModule = useDelayedPenaltyModule();
  return <DelayedPenaltyReportForm key={key} module={delayedPenaltyModule} />;
};
