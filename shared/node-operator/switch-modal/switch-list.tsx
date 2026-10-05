import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { InlineLoader, Text } from '@lidofinance/lido-ui';
import { OperatorRef } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC, useMemo } from 'react';
import { Stack } from 'shared/components';
import { GroupSection } from './group-section';
import { OperatorRow } from './operator-row';
import { useGroupedOperators } from './use-grouped-operators';

type SwitchListProps = {
  active: ModuleNodeOperator;
  list: ModuleNodeOperator[];
  onSwitch: (operator: OperatorRef) => void;
};

export const SwitchList: FC<SwitchListProps> = ({ active, list, onSwitch }) => {
  const { groups, ungrouped, isPending } = useGroupedOperators(list);

  const availableMap = useMemo(
    () =>
      new Map(
        list
          .filter((op) => op.module === MODULE_NAME.CM)
          .map((op) => [op.nodeOperatorId, op]),
      ),
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
          active={active}
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
              key={`${op.module}-${op.nodeOperatorId}`}
              nodeOperatorId={op.nodeOperatorId}
              module={op.module}
              shortInfo={op}
              action={
                op.nodeOperatorId === active.nodeOperatorId &&
                op.module === active.module
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
