import { useNodeOperatorsList } from 'providers/node-operator-provider/use-node-operators-list';
import useDappnodeUrls from './use-dappnode-urls';
import { useGetActiveNodeOperator } from 'providers/node-operator-provider/use-get-active-node-operator';
import { useEffect, useState } from 'react';

export const useGetOperatorPerformance = () => {
  const { backendUrl } = useDappnodeUrls();
  const { list } = useNodeOperatorsList();
  const { active: activeNO } = useGetActiveNodeOperator(list);
  const [operatorData, setOperatorData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getDataWithRetry = async () => {
      const url = `${backendUrl}/api/v0/events_indexer/operator_performance?operatorId=${activeNO?.id}`;
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      const retryInterval = 5000; // 5 seconds

      setIsLoading(true);

      const shouldRetry = true;
      while (shouldRetry) {
        try {
          console.debug(
            `Fetching operator performance data from events indexer API...`,
          );
          const response = await fetch(url, options);

          if (response.status === 202) {
            console.debug(
              `Received status 202. Retrying in ${retryInterval / 1000} seconds...`,
            );
            await new Promise((resolve) => setTimeout(resolve, retryInterval));
            continue;
          }

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();
          setOperatorData(data);
          break; // Exit loop when successful
        } catch (e) {
          console.error(`Error fetching operator performance data: ${e}`);
          break; // Stop retrying on other errors
        }
      }

      setIsLoading(false);
    };

    if (activeNO) {
      void getDataWithRetry();
    }
  }, [activeNO, backendUrl]);

  return { operatorData, isLoading };
};
