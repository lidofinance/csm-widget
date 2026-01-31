import { Button, Text } from '@lidofinance/lido-ui';
import { CM_MAINNET_LINK } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { FC, useMemo } from 'react';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { StyledBlock, StyledStack } from './styles';
import { useExternalLinks } from 'shared/hooks';

export const NavigateCMv1: FC = () => {
  const { operatorsWidget } = useExternalLinks();
  const host = useMemo(() => new URL(operatorsWidget).host, [operatorsWidget]);
  return (
    <StyledBlock>
      <StyledStack>
        <Text weight={700} size="lg">
          Navigate to CM v1
        </Text>
        <MatomoLink
          href={CM_MAINNET_LINK}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          <Button size="xs" variant="outlined">
            Open CM v1 widget
          </Button>
        </MatomoLink>
      </StyledStack>
      <Text color="secondary" size="xs">
        If you are looking for the CM v1 interface, please navigate to
        <MatomoLink
          href={operatorsWidget}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          {host}
        </MatomoLink>
        .
      </Text>
    </StyledBlock>
  );
};
