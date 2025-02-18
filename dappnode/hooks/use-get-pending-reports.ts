import { useEffect, useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';
import { useNodeOperatorsList } from 'providers/node-operator-provider/use-node-operators-list';
import { useGetActiveNodeOperator } from 'providers/node-operator-provider/use-get-active-node-operator';

export const useGetPendingReports = () => {
  const { backendUrl } = useDappnodeUrls();
  const { list } = useNodeOperatorsList();
  const { active: activeNO } = useGetActiveNodeOperator(list);

  const [pendingReports, setPendingReports] = useState();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getPendingReports = async () => {
      setIsLoading(true);
      try {
        console.debug(`GETting pending reports from events indexer API`);
        const response = await fetch(
          `${backendUrl}/api/v0/events_indexer/pending_hashes?operatorId=${activeNO?.id}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPendingReports(data.length);
        setIsLoading(false);
      } catch (e) {
        console.error(
          `Error GETting pending reports from events indexer API: ${e}`,
        );
        setIsLoading(false);
      }
    };

    if (activeNO) {
      void getPendingReports();
    }
  }, [activeNO, backendUrl]);

  return { isLoading, pendingReports };
};
