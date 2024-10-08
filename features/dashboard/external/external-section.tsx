import { Accordion, Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ExternalButtonLink } from './external-button-link';

import { ReactComponent as BeaconchaIcon } from 'assets/icons/beaconcha.svg';
import { ReactComponent as LidoIcon } from 'assets/icons/lido.svg';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import {
  useBeaconchainDashboardLink,
  useFeesMonitoningLink,
  useOperatorPortalLink,
} from 'shared/hooks';
import invariant from 'tiny-invariant';

export const ExternalSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();

  const beaconchainDashboardLink = useBeaconchainDashboardLink(nodeOperatorId);
  const feesMonitoningLink = useFeesMonitoningLink(nodeOperatorId);
  const operatorPortalLink = useOperatorPortalLink(nodeOperatorId);

  invariant(nodeOperatorId);

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
        {beaconchainDashboardLink && (
          <ExternalButtonLink
            title="beaconcha.in v2"
            icon={<BeaconchaIcon />}
            href={beaconchainDashboardLink}
            matomoEvent={
              MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink
            }
          >
            Dashboard displays statistics of your validators (up to 20 in free
            plan)
          </ExternalButtonLink>
        )}
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
