import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';
import { AttestationRateSection } from './attestation-rate-section';
import { isModuleCSM } from 'consts';

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        {isModuleCSM && <AttestationRateSection />}
        {isModuleCSM && <StrikesSection />}
        <ExternalSection />
        {isModuleCSM && <NotificationToolsSection />}
      </NoSSRWrapper>
    </>
  );
};
