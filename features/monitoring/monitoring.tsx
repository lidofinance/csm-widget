import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';
import { AttestationRateSection } from './attestation-rate-section';

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        <AttestationRateSection />
        <StrikesSection />
        <ExternalSection />
        <NotificationToolsSection />
      </NoSSRWrapper>
    </>
  );
};
