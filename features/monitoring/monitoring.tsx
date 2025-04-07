import { FC } from 'react';
import { ExternalSection } from './external';
import { AttestationRateSection } from './attestation-rate-section';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { Faq, NoSSRWrapper } from 'shared/components';

const { defaultChain } = getConfig();

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        {defaultChain === CHAINS.Mainnet && <AttestationRateSection />}
        <ExternalSection />
      </NoSSRWrapper>
      <Faq />
    </>
  );
};
