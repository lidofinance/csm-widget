import { NodeOperatorId } from '@lidofinance/lido-csm-sdk';
import { Button, Text } from '@lidofinance/lido-ui';
import { OperatorRef } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { FC } from 'react';
import { Stack } from 'shared/components';
import { GroupCardsStyle } from './cm-styles';
import { OperatorAction, OperatorRow } from './operator-row';
import { OperatorGroupData } from './use-grouped-operators';
import { LocalLink } from 'shared/navigate';
import { PATH } from 'consts';
import { formatGroupTitle } from 'shared/node-operator/utils';

type GroupSectionProps = {
  group: OperatorGroupData;
  activeId: NodeOperatorId;
  availableMap: Map<bigint, ModuleNodeOperator>;
  onSwitch: (operator: OperatorRef) => void;
};

const getAction = (
  operatorId: NodeOperatorId,
  activeId: NodeOperatorId,
  availableIds: Set<bigint>,
): OperatorAction => {
  if (operatorId === activeId) return 'current';
  if (availableIds.has(operatorId)) return 'switch';
  return 'view';
};

export const GroupSection: FC<GroupSectionProps> = ({
  group,
  activeId,
  availableMap,
  onSwitch,
}) => {
  return (
    <Stack direction="column" gap="sm">
      <Stack center spaceBetween>
        <Text size="xs" weight={700}>
          {formatGroupTitle(group)}
        </Text>
        {group.allOperatorIds.includes(activeId) && (
          <LocalLink href={PATH.GROUP}>
            <Button size="xs" variant="ghost">
              View
            </Button>
          </LocalLink>
        )}
      </Stack>
      <GroupCardsStyle>
        {group.allOperatorIds.map((operatorId) => (
          <OperatorRow
            key={String(operatorId)}
            nodeOperatorId={operatorId}
            shortInfo={availableMap.get(operatorId)}
            stakeSummary={group.stakeSummaries.get(operatorId)}
            action={getAction(operatorId, activeId, group.availableIds)}
            onSwitch={onSwitch}
          />
        ))}
      </GroupCardsStyle>
    </Stack>
  );
};
