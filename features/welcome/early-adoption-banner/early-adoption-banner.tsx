import { FC } from 'react';

import { LinkButton, Stack } from 'shared/components';
import { BlockStyled, Header, Heading } from './styles';
import { DarkThemeProvider, LightThemeProvider } from '@lidofinance/lido-ui';

export const EarlyAdoptionBanner: FC = () => {
  return (
    <BlockStyled>
      <Heading>
        <Header>Early Adoption mode is active</Header>
        <p>
          During this period, only curated community stakers are eligible to
          join CSM. After the end of the period, CSM entry will be fully
          permissionless.
        </p>
      </Heading>
      <Stack>
        <LightThemeProvider>
          <LinkButton
            href="https://operatorportal.lido.fi/modules/community-staking-module#block-ef60a1fa96ae4c7995dd7794de2a3e22"
            variant="text"
            fullwidth
          >
            Learn more about Early Adoption
          </LinkButton>
        </LightThemeProvider>
        <DarkThemeProvider>
          <LinkButton
            href="https://github.com/lidofinance/community-staking-module/tree/main/artifacts/holesky/early-adoption/sources"
            variant="translucent"
            fullwidth
          >
            See curated list
          </LinkButton>
        </DarkThemeProvider>
      </Stack>
    </BlockStyled>
  );
};
