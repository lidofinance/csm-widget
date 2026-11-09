import { Body, Card, H1, Stack } from '@lidofinance/lido-app-ui';
import { LIDO_OPERATOR_PORTAL_BASE, WIDGET_TITLE } from 'consts';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, PropsWithChildren } from 'react';
import { MatomoLink } from 'shared/components';

export const WelcomeSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <Card data-testid="welcomeSection">
      <Stack gap={24}>
        <H1>{WIDGET_TITLE}</H1>
        <Body>
          Lido Node Operators run validators in the Community Staking Module
          (CSM), a permissionless module for community stakers, and in the
          Curated Module v2 (CM), for allow-listed professional operators. For a
          detailed description of the modules, follow the{' '}
          <MatomoLink
            $inline
            href={LIDO_OPERATOR_PORTAL_BASE}
            matomoEvent={MATOMO_CLICK_EVENTS_TYPES.welcomeDetailedLink}
          >
            link
          </MatomoLink>
          .
        </Body>
        {children}
      </Stack>
    </Card>
  );
};
