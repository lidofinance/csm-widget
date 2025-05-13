import { FC, PropsWithChildren } from 'react';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink } from 'shared/components';
import {
  BlockStyled,
  CSMLogo,
  ContentWrapper,
  Header,
  Heading,
} from './styles';

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => (
  <BlockStyled data-testid="welcomeSection">
    <Heading>
      <CSMLogo />
      <Header>Community Staking Module</Header>
    </Heading>
    <ContentWrapper>
      <p>
        The Community Staking Module (CSM) is a permissionless staking module
        aimed at attracting community stakers to participate in the Lido on
        Ethereum protocol as Node Operators. For a detailed description of the
        module, follow the{' '}
        <MatomoLink
          href="https://operatorportal.lido.fi/modules/community-staking-module"
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
        >
          link
        </MatomoLink>
        .
      </p>
    </ContentWrapper>
    {children}
  </BlockStyled>
);
