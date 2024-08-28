import { Accordion, Text } from '@lidofinance/lido-ui';
import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { ExternalButtonLink } from './external-button-link';

import { ReactComponent as BeaconchaIcon } from 'assets/icons/beaconcha.svg';
import { ReactComponent as LidoIcon } from 'assets/icons/lido.svg';
import { getCsmConstants } from 'consts/csm-constants';
import { getExternalLinks } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useAccount, useNodeOperatorKeys } from 'shared/hooks';
import invariant from 'tiny-invariant';

export const ExternalSection: FC = () => {
  const { chainId } = useAccount();
  const nodeOperatorId = useNodeOperatorId();
  const { data: keys } = useNodeOperatorKeys(nodeOperatorId, false, 20);

  const links = getExternalLinks(chainId);
  const moduleId = getCsmConstants(chainId).stakingModuleId;

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
        <ExternalButtonLink
          title="beaconcha.in v2"
          icon={<BeaconchaIcon />}
          // TODO: cache dashboard link (for long-fetched keys)
          href={`${links.beaconchainDashboard}/dashboard?validators=${keys?.join(',') ?? ''}`}
          matomoEvent={MATOMO_CLICK_EVENTS_TYPES.dashboardExternalBeaconchaLink}
        >
          Dashboard displays statistics of your validators (up to 20 in free
          plan)
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido operators"
          icon={<LidoIcon />}
          href={`${links.operatorsWidget}/module/${moduleId}/${nodeOperatorId}`}
          matomoEvent={
            MATOMO_CLICK_EVENTS_TYPES.dashboardExternalOperatorsPortalLink
          }
        >
          Shows details about invalid keys
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido MEV monitoring"
          icon={<LidoIcon />}
          href={`${links.feesMonitoring}/operatorInfo?stakingModuleIndex=${moduleId}&operatorIndex=${nodeOperatorId}`}
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
