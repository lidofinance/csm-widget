import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';
import { DATA_UNAVAILABLE } from 'consts/text';
import {
  useDappStatus,
  useNodeOperatorId,
  useOperatorInfo,
} from 'modules/web3';
import { FC } from 'react';
import { IconTooltip, MatomoLink, Stack } from 'shared/components';
import { formatDate, formatPercent } from 'utils';
import { DiffBadge } from './diff-badge';
import { Rate } from './styles';
import { Tip } from './tip';
import { usePerformanceApi } from './use-performance-api';
import { PerformanceMetricMethodology } from './performance-metric-methodology';

export const AttestationRateSection: FC = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo(nodeOperatorId);
  const { data, error } = usePerformanceApi();
  const { chainId } = useDappStatus();

  const showThisSection =
    chainId === CHAINS.Mainnet && (data || (info?.totalDepositedKeys ?? 0) > 0);

  if (!showThisSection) return null;

  return (
    <Block>
      <Stack direction="column" gap="xl">
        <Stack spaceBetween align="baseline">
          <Stack direction="column" gap="xxs">
            <Text as="h2" size="md" weight={800}>
              Unified Performance Rating
            </Text>
            {data && (
              <div>
                Monitoring frame: {formatDate(data.startTimestamp)} —{' '}
                {formatDate(data.endTimestamp)}
              </div>
            )}
          </Stack>
          <Stack center gap="xs">
            <div>
              Data Source:{' '}
              <MatomoLink href="https://migalabs.io">MigaLabs</MatomoLink>
            </div>
            <IconTooltip
              placement="bottomRight"
              tooltip="This is aggregated data for your Node Operator obtained from the third-party source, while the actual performance for rewards distribution is calculated per key by the CSM Performance Oracle at the end of each frame. "
            />
          </Stack>
        </Stack>
        {data ? (
          <>
            <Stack center gap="sm" wrap>
              <Rate>{formatPercent(data.operatorAttestationRate)}</Rate>
              <Stack center gap="xs" wrap>
                <DiffBadge
                  values={[data.operatorAttestationRate, data.threshold]}
                  status={data.status}
                />
                <Text size="xs" color="secondary">
                  {data.status !== 'bad'
                    ? 'above Performance Threshold'
                    : 'below Performance Threshold'}
                </Text>
                <IconTooltip
                  placement="bottomRight"
                  tooltip="Performance threshold is utilized to determine the allocation of the actual Node Operator rewards. Validators with performance above the threshold are included in the allocation pool, while the rest are not. Read more in the FAQ section."
                />
              </Stack>
            </Stack>
            {data.status !== 'good' && <Tip danger={data.status === 'bad'} />}
          </>
        ) : error ? (
          <Text size="sm" color="secondary">
            {DATA_UNAVAILABLE}
          </Text>
        ) : (
          <InlineLoader />
        )}
        <PerformanceMetricMethodology />
      </Stack>
    </Block>
  );
};
