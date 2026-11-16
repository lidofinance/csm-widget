import {
  MessageBox,
  Skeleton,
  Stack,
  Typography,
} from '@lidofinance/lido-app-ui';
import { StretchCard } from 'shared/components';
import {
  KeysNeededTag,
  StakeAllocationBar,
  StakeAllocationStats,
} from 'shared/components/stake-allocation';
import { FC, useId } from 'react';
import type { StakeAndKeysData } from 'utils/compute-stake-data';
import { formatBP } from 'utils';

type Props = {
  totals: StakeAndKeysData | undefined;
  totalWeight: bigint;
  isPending: boolean;
  isError: boolean;
};

export const GroupSummaryCard: FC<Props> = ({
  totals,
  totalWeight,
  isPending,
  isError,
}) => {
  const titleId = useId();
  const weightZero = totalWeight === 0n;

  return (
    <StretchCard
      dataTestId={{ root: 'groupSummaryCard' }}
      aria-labelledby={titleId}
    >
      <Stack direction="row" justify="between" align="start" gap={16} wrap>
        <Stack gap={4}>
          <Typography
            variant="h3"
            as="p"
            id={titleId}
            dataTestId={{ root: 'groupSummaryTitle' }}
          >
            Group summary
          </Typography>
          <Typography
            variant="bodyLarge"
            color="secondary"
            dataTestId={{ root: 'groupTotalWeight' }}
          >
            Weight: {formatBP(totalWeight)}
          </Typography>
        </Stack>
        <KeysNeededTag
          potentialAdditionalKeys={totals?.potentialAdditionalKeys}
          weightZero={weightZero}
          pending={isPending}
        />
      </Stack>
      {isError ? (
        <MessageBox variant="error">
          Failed to load the group. Try again later.
        </MessageBox>
      ) : (
        <Stack direction="column" gap={16}>
          <StakeAllocationStats size="summary" data={totals} />
          {totals ? (
            <StakeAllocationBar data={totals} weightZero={weightZero} />
          ) : (
            <Skeleton variant="block" style={{ height: 8 }} />
          )}
        </Stack>
      )}
    </StretchCard>
  );
};
