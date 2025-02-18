import { FC } from 'react';
import { SectionBlock, Stack } from 'shared/components';
import { InfraItem, InfraItemProps } from './InfraItem';
import { Card, Row } from './styles';
import { Warnings } from './warnings';
import { useGetInfraStatus } from 'dappnode/hooks/use-get-infra-status';
import useApiBrain from 'dappnode/hooks/use-brain-keystore-api';
import { capitalizeFirstChar } from 'dappnode/utils/capitalize-first-char';
import { Link } from '@lidofinance/lido-ui';
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';
import useGetRelaysData from 'dappnode/hooks/use-get-relays-data';

export const StatusSection: FC = () => {
  const { ECName, ECStatus, CCName, CCStatus, isCCLoading, isECLoading } =
    useGetInfraStatus();

  const { isMEVRunning, isLoading: relaysLoading } = useGetRelaysData();
  const {
    pubkeys: brainKeys,
    isLoading: brainLoading,
    error: brainError,
  } = useApiBrain();

  const { stakersUiUrl } = useDappnodeUrls();

  const infraItems: InfraItemProps[] = [
    {
      title: ECName ? capitalizeFirstChar(ECName) : '-',
      subtitle: 'Execution Client',
      status: ECStatus || 'NOT_INSTALLED',
      isLoading: isECLoading,
    },
    {
      title: CCName ? capitalizeFirstChar(CCName) : '-',
      subtitle: 'Consensus Client',
      status: CCStatus || 'NOT_INSTALLED',
      isLoading: isCCLoading,
    },
    {
      title: 'Web3signer',
      subtitle: 'Signer',
      status: brainKeys ? 'INSTALLED' : 'NOT_INSTALLED',
      isLoading: brainLoading,
    },
    {
      title: 'MEV Boost',
      subtitle: 'Relays',
      status: isMEVRunning ? 'INSTALLED' : 'NOT_INSTALLED',
      isLoading: relaysLoading,
    },
  ];

  return (
    <SectionBlock title="Status">
      <Stack direction="column" gap="md">
        <Card>
          <Row>
            {infraItems.map((infra, i) => (
              <InfraItem
                key={i}
                title={infra.title}
                status={infra.status}
                subtitle={infra.subtitle}
                isLoading={infra.isLoading}
              />
            ))}
          </Row>

          {!!brainError ||
          ECStatus === 'NOT_INSTALLED' ||
          CCStatus === 'NOT_INSTALLED' ||
          !isMEVRunning ? (
            <Link href={stakersUiUrl}>Set up your node</Link>
          ) : null}
        </Card>
        <Warnings />
      </Stack>
    </SectionBlock>
  );
};
