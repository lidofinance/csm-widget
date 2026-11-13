import {
  IconArrowRight,
  ProgressBar,
  Stack,
  StatCardMeta,
  TextLink,
  Typography,
} from '@lidofinance/lido-app-ui';
import { MATOMO_CLICK_EVENTS_TYPES, PATH } from 'consts';
import {
  useModule,
  useNodeOperatorId,
  useOperatorInfo,
  useOperatorKeysWithStatus,
  useOperatorStakeSummary,
} from 'modules/web3';
import { FC } from 'react';
import { StretchCard } from 'shared/components';
import {
  KeyLimitNote,
  KeysNeededTag,
  StakeAllocationBar,
  StakeAllocationRows,
} from 'shared/components/stake-allocation';
import { useKeysBreakdown } from 'shared/hooks';
import styled from 'styled-components';
import { computeStakeData, trackMatomoEvent } from 'utils';
import { getKeysStatusItems } from '../utils/get-keys-status-items';
import { toKeysMetaItems } from './keys-status-meta';

const StakeMeta = styled(StatCardMeta)`
  &&,
  && * {
    font-size: var(--lido-app-ui-font-size-tooltip);
    line-height: var(--lido-app-ui-line-height-description);
  }
`;

export const StakeCard: FC = () => {
  const { module } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const summaryQuery = useOperatorStakeSummary({ nodeOperatorId, module });
  const infoQuery = useOperatorInfo({ nodeOperatorId });
  const keysQuery = useOperatorKeysWithStatus({ nodeOperatorId });
  const { data: breakdown } = useKeysBreakdown({ nodeOperatorId });

  const summary = summaryQuery.data;
  const info = infoQuery.data;
  const keys = keysQuery.data;
  const needsKeys = summary?.currentStake === 0n;
  const data =
    summary && info && (keys || !needsKeys)
      ? computeStakeData(summary, info, keys)
      : undefined;
  const weightZero = summary?.weight === 0n;
  const isError =
    summaryQuery.isError ||
    infoQuery.isError ||
    (keysQuery.isError && needsKeys);

  const metaItems = breakdown?.counts
    ? toKeysMetaItems(
        getKeysStatusItems(breakdown.counts, {
          isCsmFamily: false,
          includeDepositable: false,
        }),
      )
    : [];

  return (
    <StretchCard dataTestId={{ root: 'dashboardKeysSection' }}>
      <Stack direction="column" gap={16}>
        <Stack direction="row" justify="between" align="center">
          <Stack direction="row" gap={8} align="center">
            <Typography variant="bodyLarge" color="secondary">
              Stake
            </Typography>
            {!isError && (
              <KeysNeededTag
                potentialAdditionalKeys={data?.potentialAdditionalKeys}
                empty={!info?.totalAddedKeys}
                weightZero={weightZero}
                pending={!data}
              />
            )}
          </Stack>
          <TextLink
            href={PATH.KEYS}
            icon={<IconArrowRight />}
            onClick={() =>
              trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.dashboardKeysLink)
            }
            dataTestId={{ root: 'sectionHeaderLink' }}
          >
            Keys
          </TextLink>
        </Stack>
        <StakeAllocationRows data={data} error={isError} />
        {data ? (
          <StakeAllocationBar data={data} weightZero={weightZero} />
        ) : (
          !isError && <ProgressBar aria-label="Stake allocation" />
        )}
        <KeyLimitNote info={info} />
        {metaItems.length > 0 && <StakeMeta items={metaItems} />}
      </Stack>
    </StretchCard>
  );
};
