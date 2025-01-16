import { Accordion, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ExternalButtonLink } from './external-button-link';

import { ReactComponent as BeaconchaIcon } from 'assets/icons/beaconcha.svg';
import { ReactComponent as RatedIcon } from 'assets/icons/rated.svg';
import { ReactComponent as LidoIcon } from 'assets/icons/lido.svg';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useBeaconchainDashboardLink,
  useFeesMonitoningLink,
  useOperatorPortalLink,
  useRatedLink,
} from 'shared/hooks';

export const ExternalSection: FC = () => {
  const beaconchainDashboardLink = useBeaconchainDashboardLink();
  const feesMonitoningLink = useFeesMonitoningLink();
  const operatorPortalLink = useOperatorPortalLink();
  const ratedLink = useRatedLink();

  return (
    <Accordion
      defaultExpanded={false}
      summary={
        <Text as="h2" size="md" weight={800}>
          External dashboards
        </Text>
      }
    >
      <Stack wrap>
        <ExternalButtonLink
          title="beaconcha.in v2"
          icon={<BeaconchaIcon />}
          href={beaconchainDashboardLink}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink}
        >
          Dashboard displays statistics of your validators (up to 20 in free
          plan)
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Rated explorer"
          icon={<RatedIcon />}
          href={ratedLink}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardExternalRatedLink}
        >
          Provides effectiveness ratings, APRs and other useful metrics
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido operators"
          icon={<LidoIcon />}
          href={operatorPortalLink}
          matomoEvent={
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink
          }
        >
          Shows details about invalid keys
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido MEV monitoring"
          icon={<LidoIcon />}
          href={feesMonitoningLink}
          matomoEvent={
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalFeesMonitoringLink
          }
        >
          Tracks missed slots and blocks with incorrect fee recipient/MEV relays
        </ExternalButtonLink>
      </Stack>
    </Accordion>
  );
};
