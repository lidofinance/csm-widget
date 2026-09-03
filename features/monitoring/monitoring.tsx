import { useModule } from 'modules/web3';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { ExternalSection } from './external-section';
import { NotificationToolsSection } from './notification-tools-section';
import { StrikesSection } from './strikes-section';
import { AttestationRateSection } from './attestation-rate-section';

export const Monitoring: FC = () => {
  const { isCsmFamily } = useModule();

  return (
    <>
      <NoSSRWrapper>
        {isCsmFamily && <AttestationRateSection />}
        {isCsmFamily && <StrikesSection />}
        <ExternalSection />
        <NotificationToolsSection />
      </NoSSRWrapper>
    </>
  );
};
