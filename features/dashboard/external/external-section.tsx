import { useNodeOperatorId } from 'providers/node-operator-provider';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { NodeOperatorId } from 'types';
import { ExternalButtonLink } from './external-button-link';
import { Accordion, Text } from '@lidofinance/lido-ui';

import { ReactComponent as BeaconchaIcon } from 'assets/icons/beaconcha.svg';
import { ReactComponent as LidoIcon } from 'assets/icons/lido.svg';
import { useNodeOperatorKeys } from 'shared/hooks';

const getFeesMonitoringLink = (id?: NodeOperatorId) =>
  `https://fees-monitoring-holesky.testnet.fi/operatorInfo?stakingModuleIndex=4&operatorIndex=${id}`;

const getOperatorsPortalLink = (id?: NodeOperatorId) =>
  `https://operators-holesky.testnet.fi/module/4/${id}`;

// TODO: cache prev link
const getBeaconchaLink = (keys: string[] = []) =>
  `https://v2-beta-holesky.beaconcha.in/dashboard?validators=${keys.join(',')}`;

export const ExternalSection: FC = () => {
  const id = useNodeOperatorId();
  const { data: keys } = useNodeOperatorKeys(id, false, 20);

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
          href={getBeaconchaLink(keys)}
        >
          Dashboard displays statistics of your validators (up to 20 in free
          plan)
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido operators"
          icon={<LidoIcon />}
          href={getOperatorsPortalLink(id)}
        >
          Shows details about invalid keys
        </ExternalButtonLink>
        <ExternalButtonLink
          title="Lido MEV monitoring"
          icon={<LidoIcon />}
          href={getFeesMonitoringLink(id)}
        >
          Tracks missed slots and blocks with incorrect fee recipient/MEV relays
        </ExternalButtonLink>
      </Stack>
    </Accordion>
  );
};
