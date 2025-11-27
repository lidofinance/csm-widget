import { ExtraWidth } from 'shared/components';
import NoSSRWrapper from 'shared/components/no-ssr-wrapper';
import { RewardsHistorySection } from './rewards-history-section';

export const RewardsHistory = () => {
  return (
    <NoSSRWrapper>
      <ExtraWidth>
        <RewardsHistorySection />
      </ExtraWidth>
    </NoSSRWrapper>
  );
};
