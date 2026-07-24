import { Button, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { MatomoLink } from 'shared/components/matomo-link/matomo-link';
import { useExternalLinks } from 'shared/hooks';
import { StyledBlock, StyledStack } from './styles';

export const NavigateCMv1: FC = () => {
  const { operatorsWidget } = useExternalLinks();
  const { host } = new URL(operatorsWidget);
  return (
    <StyledBlock data-testid="navigateCMv1Section">
      <StyledStack>
        <Text weight={700} size="lg">
          Navigate to CM v1
        </Text>
        <MatomoLink
          href={operatorsWidget}
          // matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink} // TODO: fix events
        >
          <Button size="xs" variant="outlined" data-testid="navigateToCMv1Btn">
            Open CM v1 widget
          </Button>
        </MatomoLink>
      </StyledStack>
      <Text color="secondary" size="xs">
        If you are looking for the CM v1 interface, please navigate to{' '}
        <MatomoLink
          $inline
          href={operatorsWidget}
          // matomoEvent={MATOMO_CLICK_EVENTS_TYPES.tryOtherNetworkLink}
        >
          {host}
        </MatomoLink>
        .
      </Text>
    </StyledBlock>
  );
};
