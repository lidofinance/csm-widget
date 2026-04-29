import { SubOperatorStakeSummary } from '@lidofinance/lido-csm-sdk';
import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { MoreKeysChip, StakeRow, StakeStats } from './shared';
import { WeightChip } from './shared/weight-chip';
import { CardHeader, CardHeaderLeft, GroupBlockStyled } from './styles';
import { useAggregatedStake } from './use-aggregated-stake';

type Props = {
  operators: SubOperatorStakeSummary[];
};

export const GroupSummary: FC<Props> = ({ operators }) => {
  const { aggregated, totalWeight, moreKeys, isPending } =
    useAggregatedStake(operators);

  return (
    <GroupBlockStyled color="foreground">
      <Stack direction="column" gap="md">
        <CardHeader>
          <CardHeaderLeft>
            <Text as="h3" size="sm" weight={800}>
              Group summary
            </Text>
            <WeightChip weight={totalWeight} />
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
    </GroupBlockStyled>
  );
};
