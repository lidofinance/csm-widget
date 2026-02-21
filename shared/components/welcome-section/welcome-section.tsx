import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { config } from 'config';
import {
  LIDO_OPERATOR_PORTAL_BASE,
  LIDO_OPERATOR_PORTAL_CM,
} from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MODULE_METADATA } from 'consts/module';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink } from 'shared/components';
import {
  BlockStyled,
  ContentWrapper,
  Header,
  Heading,
  ModuleLogo,
} from './styles';

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => {
  const DESCRIPTIONS: Record<MODULE_NAME, JSX.Element> = {
    [MODULE_NAME.CSM]: (
      <p>
        The Community Staking Module (CSM) is a permissionless staking module
        aimed at attracting community stakers to participate in the Lido on
        Ethereum protocol as Node Operators. For a detailed description of the
        module, follow the{' '}
        <MatomoLink
          $inline
          href={LIDO_OPERATOR_PORTAL_BASE}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
        >
          link
        </MatomoLink>
        .
      </p>
    ),
    [MODULE_NAME.CSM0x02]: (
      <p>
        The Community Staking Module (CSM) is a permissionless staking module
        aimed at attracting community stakers to participate in the Lido on
        Ethereum protocol as Node Operators. For a detailed description of the
        module, follow the{' '}
        <MatomoLink
          $inline
          href={LIDO_OPERATOR_PORTAL_BASE}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
        >
          link
        </MatomoLink>
        .
      </p>
    ),
    [MODULE_NAME.CM]: (
      <p>
        The Curated Module v2 (CM) consists of allow-listed independent
        professional staking organizations and Ethereum client teams, which
        operate validators using the protocol. For a detailed description of the
        module, follow{' '}
        <MatomoLink
          $inline
          href={LIDO_OPERATOR_PORTAL_CM}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
        >
          the link
        </MatomoLink>
        .
      </p>
    ),
  };

  return (
    <BlockStyled data-testid="welcomeSection">
      <Heading>
        <ModuleLogo />
        <Header>{MODULE_METADATA[config.module].title}</Header>
      </Heading>
      <ContentWrapper>{DESCRIPTIONS[config.module]}</ContentWrapper>
      {children}
    </BlockStyled>
  );
};
