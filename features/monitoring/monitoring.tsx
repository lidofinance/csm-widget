// import { getConfig } from 'config';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';

// const { defaultChain } = getConfig();

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        {/* {defaultChain === CHAINS.Mainnet && <AttestationRateSection />} */}
        <StrikesSection />
        <ExternalSection />
        <NotificationToolsSection />
      </NoSSRWrapper>
    </>
  );
};
