import { Link } from '@lidofinance/lido-ui';
import { FC, PropsWithChildren } from 'react';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { Partners } from './partners';
import { Step } from './step';
import { BlockStyled, Heading, Steps } from './styles';

export const StarterPackSection: FC<PropsWithChildren> = ({ children }) => {
  const { data: ea } = useCsmEarlyAdoption();
  const bondAmount = ea?.proof ? '1.5' : '2';

  return (
    <BlockStyled>
      <Heading>
        <h2>CSM node operator starter pack</h2>
        <p>
          Make sure you’ve completed all the basic steps before joining{' '}
          <Link href="https://operatorportal.lido.fi/modules/community-staking-module">
            the Community Staking Module
          </Link>
        </p>
      </Heading>
      <Steps>
        <Step number="1" title="Have tokens for Bond">
          {bondAmount} Holesky ETH (stETH/wstETH) is required for the first
          validator
          <br />
          <Link href="https://operatorportal.lido.fi/modules/community-staking-module#block-e4a6daadca12480d955524247f03f380">
            Learn more
          </Link>
        </Step>
        <Step number="2" title="Prepare hardware">
          Run{' '}
          <Link href="https://dvt-homestaker.stakesaurus.com/hardware-and-systems-setup/hardware-and-system-requirements">
            your own hardware
          </Link>{' '}
          or use a cloud provider
        </Step>
        <Step number="3" title="Set up validation tools">
          Do it{' '}
          <Link href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm">
            manually
          </Link>{' '}
          or use Plug&Play solutions
          <Partners />
        </Step>
        <Step number="4" title="Generate keys">
          Prepare deposit data (.json file) for submitting keys
          <br />
          Follow{' '}
          <Link href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm#key-settings-to-note">
            the generation guide
          </Link>
        </Step>
      </Steps>
      {children}
    </BlockStyled>
  );
};
