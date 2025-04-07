import { FC } from 'react';
import { ExternalSection } from './external';
import { AttestationRateSection } from './attestation-rate-section';
import { getConfig } from 'config';
import { CHAINS } from 'consts/chains';

const { defaultChain } = getConfig();

export const Monitoring: FC = () => {
  return (
    <>
      {defaultChain === CHAINS.Mainnet && <AttestationRateSection />}
      <ExternalSection />
    </>
  );
};
