import { FC, PropsWithChildren } from 'react';

import { Link } from '@lidofinance/lido-ui';
import {
  BlockStyled,
  CSMLogo,
  ContentWrapper,
  Header,
  Heading,
} from './styles';

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => (
  <BlockStyled>
    <Heading>
      <CSMLogo />
      <Header>Community Staking Module</Header>
    </Heading>
    <ContentWrapper>
      <p>
        The Community Staking Module (CSM) is a permissionless staking module
        aimed at attracting community stakers to participate in the Lido on
        Ethereum protocol as Node Operators. For a detailed description of the
        module, follow{' '}
        <Link href="https://operatorportal.lido.fi/modules/community-staking-module">
          the link
        </Link>
        .
      </p>
    </ContentWrapper>
    {children}
  </BlockStyled>
);
