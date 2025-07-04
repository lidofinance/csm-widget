import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink } from 'shared/components';
import { Partners } from './partners';
import { Step } from './step';
import { BlockStyled, Heading, Steps } from './styles';
import { RequiredBondAmount } from './required-bond-amount';
import {
  ABOUT_DEPOSIT_DATA_LINK,
  HOW_TO_GENERATE_DEPOSIT_DATA_LINK,
  PREPARE_HARDWARE_LINK,
} from 'consts/external-links';

export const StarterPackSection: FC<PropsWithChildren> = ({ children }) => (
  <BlockStyled data-testid="starterPackSection">
    <Heading>
      <h2>CSM node operator starter pack</h2>
      <p>
        Make sure you’ve completed all the basic steps before joining the{' '}
        <MatomoLink
          href="https://operatorportal.lido.fi/modules/community-staking-module"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackCSMLink}
        >
          Community Staking Module
        </MatomoLink>
      </p>
    </Heading>
    <Steps>
      <Step number="1" title="Have tokens for Bond">
        <RequiredBondAmount /> (stETH / wstETH equivalent) is required for the
        first validator
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
          href={PREPARE_HARDWARE_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackHadwareLink}
        >
          your own hardware
        </MatomoLink>{' '}
        or use a cloud provider
      </Step>
      <Step number="3" title="Set up validation tools">
        Do it{' '}
        <MatomoLink
          href={ABOUT_DEPOSIT_DATA_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackSetupValidatorLink}
        >
          manually
        </MatomoLink>{' '}
        or use Plug&Play solutions
        <Partners />
      </Step>
      <Step number="4" title="Generate keys">
        Prepare deposit data (.json file) for submitting keys
        <br />
        Follow the{' '}
        <MatomoLink
          href={HOW_TO_GENERATE_DEPOSIT_DATA_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.starterPackGenerateKeysLink}
        >
          generation guide
        </MatomoLink>
      </Step>
    </Steps>
    {children}
  </BlockStyled>
);
