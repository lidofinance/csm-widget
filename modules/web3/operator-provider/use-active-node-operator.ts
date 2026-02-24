import { NodeOperatorShortInfo } from '@lidofinance/lido-csm-sdk';
import { useEffect, useState } from 'react';
import { useCachedId } from './use-cached-id';

export const useActiveNodeOperator = (list?: NodeOperatorShortInfo[]) => {
  const [active, setActive] = useState<NodeOperatorShortInfo | undefined>();
  const [, setCachedId] = useCachedId();

  useEffect(() => {
    setActive((prev) => {
      const updated = list?.find(
        (item) => item.nodeOperatorId === prev?.nodeOperatorId,
      );

      return updated ?? list?.[0];
    });
  }, [list]);

  useEffect(() => {
    active && setCachedId(active.nodeOperatorId);
  }, [active, setCachedId]);

  return [active ?? list?.[0], setActive] as const;
};
