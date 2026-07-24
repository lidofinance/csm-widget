import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks';

import { DelayedPenaltyReportForm } from './delayed-penalty-report-form';

export const DelayedPenaltyReport = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <DelayedPenaltyReportForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
