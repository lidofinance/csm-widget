import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';
import { FC } from 'react';
import { NoSSRWrapper } from 'shared/components';
import { AttestationRateSection } from './attestation-rate-section';
import { ExternalSection } from './external';

const { defaultChain } = getConfig();

export const Monitoring: FC = () => {
  return (
    <>
      <NoSSRWrapper>
        {defaultChain === CHAINS.Mainnet && <AttestationRateSection />}
        <ExternalSection />
      </NoSSRWrapper>
    </>
  );
};
