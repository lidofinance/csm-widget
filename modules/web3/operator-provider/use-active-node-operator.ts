import { useEffect, useState } from 'react';
import { useCachedId } from './use-cached-id';
import { NodeOperator } from '@lidofinance/lido-csm-sdk/common';

export const useActiveNodeOperator = (list?: NodeOperator[]) => {
  const [active, setActive] = useState<NodeOperator | undefined>();
  const [, setCachedId] = useCachedId();

  useEffect(() => {
    if (!list) return;
    setActive((prev) => {
      const updated = list.find((item) => item.id === prev?.id);

      return updated ?? list[0];
    });
  }, [list]);

  useEffect(() => {
    active && setCachedId(active.id);
  }, [active, setCachedId]);

  return [active, setActive] as const;
};
