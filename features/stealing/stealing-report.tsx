import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { useWeb3Key } from 'shared/hooks/useWeb3Key';

import { StealingReportForm } from './stealing-report-form';

export const StealingReport = () => {
  const key = useWeb3Key();
  return (
    <>
      <NoSSRWrapper>
        <StealingReportForm key={key} />
      </NoSSRWrapper>
    </>
  );
};
