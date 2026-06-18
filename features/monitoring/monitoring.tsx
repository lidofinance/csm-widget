import { useModule } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';
import { AttestationRateSection } from './attestation-rate-section';

export const Monitoring: FC = () => {
  const { isCSM } = useModule();

  return (
    <>
      <NoSSRWrapper>
        {isCSM && <AttestationRateSection />}
        {isCSM && <StrikesSection />}
        <ExternalSection />
        {isCSM && <NotificationToolsSection />}
      </NoSSRWrapper>
    </>
  );
};
