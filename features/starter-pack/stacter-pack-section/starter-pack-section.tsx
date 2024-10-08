import { getCsmConstants } from 'consts/csm-constants';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink } from 'shared/components';
import { useCsmEarlyAdoption } from 'shared/hooks';
import { Partners } from './partners';
import { Step } from './step';
import { BlockStyled, Heading, Steps } from './styles';

const { firstKeyBond } = getCsmConstants();

export const StarterPackSection: FC<PropsWithChildren> = ({ children }) => {
  const { data: ea } = useCsmEarlyAdoption();
  const bondAmount = firstKeyBond[Number(Boolean(ea?.proof))];

  return (
    <BlockStyled>
      <Heading>
        <h2>CSM node operator starter pack</h2>
        <p>
          Make sure you’ve completed all the basic steps before joining{' '}
          <MatomoLink
            href="https://operatorportal.lido.fi/modules/community-staking-module"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackCSMLink}
          >
            the Community Staking Module
          </MatomoLink>
        </p>
      </Heading>
      <Steps>
        <Step number="1" title="Have tokens for Bond">
          {bondAmount} ETH (stETH / wstETH equivalent) is required for the first
          validator
          <br />
          <MatomoLink
            href="https://operatorportal.lido.fi/modules/community-staking-module#block-e4a6daadca12480d955524247f03f380"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackBondLink}
          >
            Learn more
          </MatomoLink>
        </Step>
        <Step number="2" title="Prepare hardware">
          Run{' '}
          <MatomoLink
            href="https://dvt-homestaker.stakesaurus.com/hardware-and-systems-setup/hardware-and-system-requirements"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackHadwareLink}
          >
            your own hardware
          </MatomoLink>{' '}
          or use a cloud provider
        </Step>
        <Step number="3" title="Set up validation tools">
          Do it{' '}
          <MatomoLink
            href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm"
            matomoEvent={
              MATOMO_CLICK_EVENTS_TYPES.starterPackSetupValidatorLink
            }
          >
            manually
          </MatomoLink>{' '}
          or use Plug&Play solutions
          <Partners />
        </Step>
        <Step number="4" title="Generate keys">
          Prepare deposit data (.json file) for submitting keys
          <br />
          Follow{' '}
          <MatomoLink
            href="https://dvt-homestaker.stakesaurus.com/bonded-validators-setup/lido-csm#key-settings-to-note"
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackGenerateKeysLink}
          >
            the generation guide
          </MatomoLink>
        </Step>
      </Steps>
      {children}
    </BlockStyled>
  );
};
