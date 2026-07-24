import {
  NodeOperatorId,
  NodeOperatorShortInfo,
} from '@lidofinance/lido-csm-sdk';
import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { FC, useMemo } from 'react';
import { Stack } from 'shared/components';
import { GroupSection } from './group-section';
import { OperatorRow } from './operator-row';
import { useGroupedOperators } from './use-grouped-operators';

type CmSwitchListProps = {
  active: NodeOperatorShortInfo;
  list: NodeOperatorShortInfo[];
  onSwitch: (id: NodeOperatorId) => void;
};

export const CmSwitchList: FC<CmSwitchListProps> = ({
  active,
  list,
  onSwitch,
}) => {
  const { groups, ungrouped, isPending } = useGroupedOperators(list);

  const availableMap = useMemo(
    () => new Map(list.map((op) => [op.nodeOperatorId, op])),
    [list],
  );

  if (isPending) {
    return <InlineLoader />;
  }

  return (
    <Stack direction="column" gap="lg">
      {groups.map((group) => (
        <GroupSection
          key={String(group.groupId)}
          group={group}
          activeId={active.nodeOperatorId}
          availableMap={availableMap}
          onSwitch={onSwitch}
        />
      ))}

      {ungrouped.length > 0 && (
        <Stack direction="column" gap="sm">
          {groups.length > 0 && (
            <Text size="xs" weight={700}>
              Other Node operators
            </Text>
          )}
          {ungrouped.map((op) => (
            <OperatorRow
              key={String(op.nodeOperatorId)}
              nodeOperatorId={op.nodeOperatorId}
              shortInfo={op}
              action={
                op.nodeOperatorId === active.nodeOperatorId
                  ? 'current'
                  : 'switch'
              }
              onSwitch={onSwitch}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
};
