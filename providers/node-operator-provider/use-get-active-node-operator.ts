import { useCallback, useEffect, useState } from 'react';
import { NodeOperatorId, NodeOperatorRoles } from 'types';

export const useGetActiveNodeOperator = (
  list?: NodeOperatorRoles[],
  onChange?: (a?: NodeOperatorRoles) => void,
) => {
  const [active, setActive] = useState<NodeOperatorRoles | undefined>();

  useEffect(() => {
    if (list)
      setActive((active) => {
        const fromList = list.find((i) => i.id === active?.id);
        if (fromList) {
          if (
            fromList.rewards === active?.rewards &&
            fromList.manager === active?.manager
          ) {
            return active;
          } else {
            return fromList;
          }
        }
        return list[0];
      });
  }, [list]);

  useEffect(() => {
    onChange?.(active);
  }, [active, onChange]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const active = list?.find((roles) => roles.id === id);
      if (active) {
        setActive(active);
      }
    },
    [list],
  );

  return { active, switchActive };
};
