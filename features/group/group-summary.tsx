import { SubOperatorStakeSummary } from '@lidofinance/lido-csm-sdk';
import { Block, InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { SquaredChip, Stack } from 'shared/components';
import { StakeStats, MoreKeysChip, StakeRow } from './shared';
import { CardHeader, CardHeaderLeft } from './styles';
import { useAggregatedStake } from './use-aggregated-stake';

type Props = {
  operators: SubOperatorStakeSummary[];
};

export const GroupSummary: FC<Props> = ({ operators }) => {
  const { aggregated, totalWeight, moreKeys, isPending } =
    useAggregatedStake(operators);

  return (
    <Block>
      <Stack direction="column" gap="md">
        <CardHeader>
          <CardHeaderLeft>
            <Text as="h3" size="sm" weight={800}>
              Group summary
            </Text>
            {totalWeight !== undefined && (
              <SquaredChip>Weight: {String(totalWeight)}</SquaredChip>
            )}
          </CardHeaderLeft>
          <MoreKeysChip more={moreKeys} isPending={isPending} />
        </CardHeader>

        {!aggregated ? (
          <StakeRow>
            <InlineLoader />
          </StakeRow>
        ) : (
          <StakeStats data={aggregated} />
        )}
      </Stack>
    </Block>
  );
};
