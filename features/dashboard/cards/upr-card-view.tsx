import {
  IconPriceDown,
  IconPriceUp,
  InfoTooltip,
  Skeleton,
  Stack,
  StatCard,
  Tag,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts';
import { DATA_UNAVAILABLE } from 'consts/text';
import { FC } from 'react';
import { Performance } from 'types';
import { formatDate, formatPercent, trackMatomoEvent } from 'utils';
import { getUprDelta } from '../utils/get-upr-delta';

type UprCardViewProps = {
  data?: Performance;
  isPending: boolean;
  isError: boolean;
  sourceHref: string;
};

const UPR_INFO =
  'Performance threshold is utilized to determine the allocation of the actual Node Operator rewards. Validators with performance above the threshold are included in the allocation pool, while the rest are not. Read more in the FAQ section.';

const SOURCE_INFO =
  'This is aggregated data for your Node Operator obtained from the third-party source, while the actual performance for rewards distribution is calculated per key by the CSM Performance Oracle at the end of each frame';

const UprTag: FC<{ data: Performance }> = ({ data }) => {
  const { direction, diff } = getUprDelta(data);

  return direction === 'above' ? (
    <Tag variant="success" icon={<IconPriceUp />}>
      {formatPercent(diff)} above threshold
    </Tag>
  ) : (
    <Tag variant="error" icon={<IconPriceDown />}>
      {formatPercent(diff)} below threshold
    </Tag>
  );
};

export const UprCardView: FC<UprCardViewProps> = ({
  data,
  isPending,
  isError,
  sourceHref,
}) => {
  const value = isPending ? (
    <Skeleton variant="text" />
  ) : isError || !data ? (
    DATA_UNAVAILABLE
  ) : (
    formatPercent(data.operatorAttestationRate)
  );

  return (
    <StatCard
      title="Unified Performance Rating"
      info={UPR_INFO}
      value={value}
      tag={data ? <UprTag data={data} /> : undefined}
      description={
        <Stack direction="row" justify="between" wrap>
          {data ? (
            <Typography variant="body" color="tertiary" data-testid="uprPeriod">
              {formatDate(data.startTimestamp)} —{' '}
              {formatDate(data.endTimestamp)}
            </Typography>
          ) : (
            <span />
          )}
          <Stack direction="row" gap={4} align="center">
            <Typography variant="body" color="tertiary">
              Source:
            </Typography>
            <TextLink
              href={sourceHref}
              external
              onClick={() =>
                trackMatomoEvent(
                  MATOMO_CLICK_EVENTS_TYPES.monitoringMigalabsLink,
                )
              }
            >
              EthSeer
            </TextLink>
            <InfoTooltip size={16} content={SOURCE_INFO} />
          </Stack>
        </Stack>
      }
      dataTestId={{ root: 'uprCard', value: 'uprValue', tag: 'uprDeltaTag' }}
    />
  );
};
