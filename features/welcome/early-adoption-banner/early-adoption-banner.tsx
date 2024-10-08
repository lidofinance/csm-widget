import { FC } from 'react';

import { DarkThemeProvider, LightThemeProvider } from '@lidofinance/lido-ui';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { LinkButton, Stack } from 'shared/components';
import { BlockStyled, Header, Heading } from './styles';

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
          <LightThemeProvider>
            <LinkButton
              href={links.earlyAdoptionAbout}
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionLearnMore}
              variant="text"
              fullwidth
            >
              Learn more about Early Adoption
            </LinkButton>
          </LightThemeProvider>
          <DarkThemeProvider>
            <LinkButton
              href={links.earlyAdoptionSources}
              matomoEvent={MATOMO_CLICK_EVENTS_TYPES.earlyAdoptionCuratedList}
              variant="translucent"
              fullwidth
            >
              See curated list
            </LinkButton>
          </DarkThemeProvider>
        </Stack>
      )}
    </BlockStyled>
  );
};
