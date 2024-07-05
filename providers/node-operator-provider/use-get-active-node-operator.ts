import { useCallback, useEffect, useState } from 'react';
import { NodeOperatorId, NodeOperatorRoles } from 'types';
import { useCachedId } from './use-cached-id';

export const useGetActiveNodeOperator = (list?: NodeOperatorRoles[]) => {
  const [active, setActive] = useState<NodeOperatorRoles | undefined>();
  const [cachedId, setCachedId] = useCachedId();

  useEffect(() => {
    if (list) {
      setActive((active) => {
        const id = cachedId ?? active?.id;
        const fromList = list.find((roles) => roles.id === id);

        return fromList ?? list[0];
      });
    }
  }, [list, cachedId]);

  useEffect(() => {
    active && setCachedId(active.id);
  }, [active, setCachedId]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const fromList = list?.find((roles) => roles.id === id);
      if (fromList) {
        setActive(fromList);
      }
    },
    [list],
  );

  return { active: active ?? list?.[0], switchActive };
};
