import {
  Grid,
  MessageBox,
  SectionTitle,
  Stack,
} from '@lidofinance/lido-app-ui';
import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import {
  useAvailableOperators,
  useNodeOperator,
  useOperatorGroupStakeSummary,
} from 'modules/web3';
import { FC, useEffect, useMemo } from 'react';
import { formatGroupLabel, isSameOperator } from 'shared/node-operator/utils';
import { GroupMemberCard } from './group-member-card';
import { GroupSectionSkeleton } from './group-section-skeleton';
import { GroupSummaryCard } from './group-summary-card';
import { sortGroupMembers } from './sort-group-members';
import { useGroupStake } from './use-group-stake';

const EMPTY: never[] = [];

type Props = {
  nodeOperatorId: NodeOperatorId;
  onMissing?: () => void;
};

export const GroupSection: FC<Props> = ({ nodeOperatorId, onMissing }) => {
  const {
    data: group,
    isPending,
    isError,
  } = useOperatorGroupStakeSummary({ nodeOperatorId, module: MODULE_NAME.CM });
  const { nodeOperator } = useNodeOperator();
  const { data: available } = useAvailableOperators();
  const {
    members,
    totals,
    totalWeight,
    isPending: isStakePending,
    isError: isStakeError,
  } = useGroupStake(group?.operators ?? EMPTY);

  const isMissing = !isPending && !isError && !group;
  useEffect(() => {
    if (isMissing) onMissing?.();
  }, [isMissing, onMissing]);

  const sorted = useMemo(() => {
    const availableIds = new Set(
      (available ?? [])
        .filter((op) => op.module === MODULE_NAME.CM)
        .map((op) => op.nodeOperatorId),
    );
    return sortGroupMembers(
      members.map((member) => ({
        nodeOperatorId: member.summary.nodeOperatorId,
        member,
      })),
      {
        activeId:
          nodeOperator?.module === MODULE_NAME.CM
            ? nodeOperator.nodeOperatorId
            : undefined,
        availableIds,
      },
    ).map(({ member }) => member);
  }, [members, available, nodeOperator]);

  if (isPending) return <GroupSectionSkeleton />;
  if (isError) {
    return (
      <MessageBox variant="error">
        Failed to load the group. Try again later.
      </MessageBox>
    );
  }
  if (!group) return null;

  return (
    <Stack
      direction="column"
      gap={16}
      data-testid="groupSection"
      data-group-id={String(group.groupId)}
    >
      <SectionTitle
        size="large"
        title={formatGroupLabel(group)}
        dataTestId={{ title: 'groupSectionTitle' }}
      />
      <Stack direction="column" gap={8}>
        <GroupSummaryCard
          totals={totals}
          totalWeight={totalWeight}
          isPending={isStakePending}
          isError={isStakeError}
        />
        <Grid columns={{ base: 2, mdDown: 1 }} gap={8}>
          {sorted.map((member) => (
            <GroupMemberCard
              key={String(member.summary.nodeOperatorId)}
              member={member}
              isCurrent={isSameOperator(
                {
                  nodeOperatorId: member.summary.nodeOperatorId,
                  module: MODULE_NAME.CM,
                },
                nodeOperator,
              )}
            />
          ))}
        </Grid>
      </Stack>
    </Stack>
  );
};
