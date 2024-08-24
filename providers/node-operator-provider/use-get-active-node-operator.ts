import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { useCallback, useEffect, useState } from 'react';
import { NodeOperator, NodeOperatorId } from 'types';
import { trackMatomoEvent } from 'utils';
import { useCachedId } from './use-cached-id';

export const useGetActiveNodeOperator = (list?: NodeOperator[]) => {
  const [active, setActive] = useState<NodeOperator | undefined>();
  const [cachedId, setCachedId] = useCachedId();

  useEffect(() => {
    if (list) {
      setActive((active) => {
        const id = cachedId ?? active?.id;
        const fromList = list.find((item) => item.id === id);

        return fromList ?? list[0];
      });
    }
  }, [list, cachedId]);

  useEffect(() => {
    active && setCachedId(active.id);
  }, [active, setCachedId]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const fromList = list?.find((item) => item.id === id);
      if (fromList) {
        trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.switchNodeOperator);
        setActive(fromList);
      }
    },
    [list],
  );

  return { active: active ?? list?.[0], switchActive };
};
