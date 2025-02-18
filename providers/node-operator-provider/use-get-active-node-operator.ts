import { useCallback, useEffect, useState } from 'react';
import { NodeOperator, NodeOperatorId } from 'types';
import { useCachedId } from './use-cached-id';
// DAPPNODE
import useDappnodeUrls from 'dappnode/hooks/use-dappnode-urls';

export const useGetActiveNodeOperator = (list?: NodeOperator[]) => {
  const [active, setActive] = useState<NodeOperator | undefined>();
  const [cachedId, setCachedId] = useCachedId();
  // DAPPNODE
  const { backendUrl } = useDappnodeUrls();

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

  useEffect(() => {
    const postNodeOperatorId = async () => {
      if (cachedId) {
        try {
          console.debug(`POSTing node operator id to events indexer API`);
          const response = await fetch(
            `${backendUrl}/api/v0/events_indexer/operatorId`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ operatorId: cachedId }),
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
        } catch (e) {
          console.error(
            `Error POSTing node operator id to events indexer API: ${e}`,
          );
        }
      }
    };

    void postNodeOperatorId();
  }, [backendUrl, cachedId]);

  const switchActive = useCallback(
    (id: NodeOperatorId) => {
      const fromList = list?.find((item) => item.id === id);
      if (fromList) {
        setActive(fromList);
      }
    },
    [list],
  );

  return { active: active ?? list?.[0], switchActive, setActive };
};
