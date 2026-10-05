import { MODULE_NAME, NodeOperatorId } from '@lidofinance/lido-csm-sdk';
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
import { useShowFlags } from 'shared/hooks';

type GroupSectionProps = {
  group: OperatorGroupData;
  active: OperatorRef;
  availableMap: Map<bigint, ModuleNodeOperator>;
  onSwitch: (operator: OperatorRef) => void;
};

const getAction = (
  operatorId: NodeOperatorId,
  active: OperatorRef,
  availableIds: Set<bigint>,
): OperatorAction => {
  if (active.module === MODULE_NAME.CM && operatorId === active.nodeOperatorId)
    return 'current';
  if (availableIds.has(operatorId)) return 'switch';
  return 'view';
};

export const GroupSection: FC<GroupSectionProps> = ({
  group,
  active,
  availableMap,
  onSwitch,
}) => {
  const { IS_NODE_OPERATOR } = useShowFlags();
  return (
    <Stack direction="column" gap="sm">
      <Stack center spaceBetween>
        <Text size="xs" weight={700}>
          {formatGroupTitle(group)}
        </Text>
        {IS_NODE_OPERATOR &&
          active.module === MODULE_NAME.CM &&
          group.allOperatorIds.includes(active.nodeOperatorId) && (
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
            module={MODULE_NAME.CM}
            shortInfo={availableMap.get(operatorId)}
            stakeSummary={group.stakeSummaries.get(operatorId)}
            action={getAction(operatorId, active, group.availableIds)}
            onSwitch={onSwitch}
          />
        ))}
      </GroupCardsStyle>
    </Stack>
  );
};
