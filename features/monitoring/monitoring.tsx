import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { AttestationRateSection } from './attestation-rate-section';
import { ExternalSection } from './external-section';
import { StrikesSection } from './strikes-section';

const { defaultChain } = getConfig();

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        {defaultChain === CHAINS.Mainnet && <AttestationRateSection />}
        <StrikesSection />
        <ExternalSection />
      </NoSSRWrapper>
    </>
  );
};
