import { NodeOperatorRoles } from 'types';

export const mergeRoles = (
  list: NodeOperatorRoles[] | undefined = [],
  patch: NodeOperatorRoles,
): NodeOperatorRoles[] => {
  const index = list.findIndex(({ id }) => id === patch.id);
  const item = { ...list[index], ...patch };

  if (item.manager || item.rewards) {
    list.splice(index >= 0 ? index : list.length, 1, item);
  } else {
    list.splice(index >= 0 ? index : list.length, 1);
  }

  return list;
};
