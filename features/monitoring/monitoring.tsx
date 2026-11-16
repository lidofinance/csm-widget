import { useModule } from 'modules/web3';
import { FC } from 'react';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';
import { AttestationRateSection } from './attestation-rate-section';

export const Monitoring: FC = () => {
  const { isCSM, isCsmFamily } = useModule();

  return (
    <>
      {isCSM && <AttestationRateSection />}
      {isCsmFamily && <StrikesSection />}
      <ExternalSection />
      <NotificationToolsSection />
    </>
  );
};
