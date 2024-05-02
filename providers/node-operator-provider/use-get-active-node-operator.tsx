import { useCallback, useEffect, useState } from 'react';
import { NodeOperatorId, NodeOperatorRoles } from 'types';

export const useGetActiveNodeOperator = (roles: NodeOperatorRoles[]) => {
  // @todo: cache in LocalStorage
  const [active, setActive] = useState<NodeOperatorRoles | undefined>();

  useEffect(() => {
    if (roles.length === 0 && !!active) {
      setActive(undefined);
    }
    if (roles.length > 0 && !active) {
      setActive(roles[0]);
    }
  }, [active, roles]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const active = roles.find((roles) => roles.id === id);
      if (active) setActive(active);
    },
    [roles],
  );

  return { active, switchActive };
};
