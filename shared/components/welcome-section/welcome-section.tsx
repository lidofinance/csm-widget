import { FC, PropsWithChildren } from 'react';

import { isModuleCM } from 'consts';
import {
  LIDO_OPERATOR_PORTAL_BASE,
  LIDO_OPERATOR_PORTAL_CM,
} from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import {
  BlockStyled,
  ContentWrapper,
  Header,
  Heading,
  ModuleLogo,
} from './styles';

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => (
  <BlockStyled data-testid="welcomeSection">
    <Heading>
      <ModuleLogo />
      <Header>
        {isModuleCM ? 'Curated Module' : 'Community Staking Module'}
      </Header>
    </Heading>
    <ContentWrapper>
      {isModuleCM ? (
        <p>
          The Curated Module v2 (CM) consists of allow-listed independent
          professional staking organizations and Ethereum client teams, which
          operate validators using the protocol. For a detailed description of
          the module, follow{' '}
          <MatomoLink
            href={LIDO_OPERATOR_PORTAL_CM}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
          >
            the link
          </MatomoLink>
          .
        </p>
      ) : (
        <p>
          The Community Staking Module (CSM) is a permissionless staking module
          aimed at attracting community stakers to participate in the Lido on
          Ethereum protocol as Node Operators. For a detailed description of the
          module, follow the{' '}
          <MatomoLink
            href={LIDO_OPERATOR_PORTAL_BASE}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
          >
            link
          </MatomoLink>
          .
        </p>
      )}
    </ContentWrapper>
    {children}
  </BlockStyled>
);
