import { FC } from 'react';

import {
  DarkThemeProvider,
  External,
  LightThemeProvider,
} from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { MatomoLink, Stack } from 'shared/components';
import { BlockStyled, Header, Heading, StyledButton } from './styles';

export const EarlyAdoptionBanner: FC = () => {
  const links = getExternalLinks();

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
      {links && (
        <Stack wrap>
          <MatomoLink
            href={links.earlyAdoptionAbout}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionLearnMore}
          >
            <LightThemeProvider>
              <StyledButton
                size="xs"
                color="secondary"
                fullwidth
                variant="text"
              >
                Learn more about Early Adoption <External />
              </StyledButton>
            </LightThemeProvider>
          </MatomoLink>
          <MatomoLink
            href={links.earlyAdoptionSources}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionCuratedList}
          >
            <DarkThemeProvider>
              <StyledButton
                size="xs"
                color="secondary"
                fullwidth
                variant="translucent"
              >
                See Early Adoption members list <External />
              </StyledButton>
            </DarkThemeProvider>
          </MatomoLink>
        </Stack>
      )}
    </BlockStyled>
  );
};
