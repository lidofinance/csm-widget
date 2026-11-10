import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyReportForm } from './delayed-penalty-report-form';

export const DelayedPenaltyReport = () => {
  const key = useWeb3Key();
  return <DelayedPenaltyReportForm key={key} />;
};
