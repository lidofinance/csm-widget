import { ROLES } from 'consts/roles';
import { NodeOperator, NodeOperatorRoles } from 'types';

const applyPatch = (
  patch: NodeOperatorRoles,
  item?: NodeOperator,
): NodeOperator => ({
  id: patch.id,
  roles: packRoles({
    manager:
      patch.manager !== false &&
      (patch.manager || item?.roles.includes(ROLES.MANAGER)),
    rewards:
      patch.rewards !== false &&
      (patch.rewards || item?.roles.includes(ROLES.REWARDS)),
  }),
});

export const packRoles = ({
  rewards,
  manager,
}: Omit<NodeOperatorRoles, 'id'>) =>
  [rewards && ROLES.REWARDS, manager && ROLES.MANAGER].filter(
    Boolean,
  ) as any as ROLES[];

export const mergeRoles = (
  list: NodeOperator[],
  patch: NodeOperatorRoles,
): NodeOperator[] => {
  const index = list.findIndex(({ id }) => id === patch.id);
  const item = applyPatch(patch, list[index]);

  if (item.roles.length > 0) {
    list.splice(index >= 0 ? index : list.length, 1, item);
  } else {
    list.splice(index >= 0 ? index : list.length, 1);
  }

  return list;
};
