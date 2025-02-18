import { useCallback, useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';
import { useActiveNodeOperator } from 'providers/node-operator-provider';
import { fetchWithRetry } from 'dappnode/utils/fetchWithRetry';

const useGetExitRequests = () => {
  const { backendUrl } = useDappnodeUrls();
  const [exitRequests, setExitRequests] = useState<ExitRequests>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const nodeOperator = useActiveNodeOperator();

  interface ExitRequest {
    event: {
      [key: string]: any;
    };
    [key: string]: any;
    validator_pubkey_hex: string;
  }
  type ExitRequests = Record<string, ExitRequest>;

  const getExitRequests = useCallback(async () => {
    try {
      setIsLoading(true);
      console.debug(`GETting validators exit requests from indexer API`);
      const url = `${backendUrl}/api/v0/events_indexer/exit_requests?operatorId=${nodeOperator?.id}`;
      const options = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      };
      const response = await fetchWithRetry(url, options, 5000);

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data: ExitRequests = await response.json();

      // Statuses to include if have not started/ended the exit process
      const includedStatuses = ['active_ongoing', 'active_slashed'];

      const filteredData = Object.fromEntries(
        Object.entries(data).filter(([, exitRequest]) =>
          includedStatuses.includes(exitRequest.status),
        ),
      );

      setExitRequests(filteredData);
      setIsLoading(false);
    } catch (e) {
      console.error(
        `Error GETting validators exit requests from indexer API: ${e}`,
      );
      setIsLoading(false);
    }
  }, [backendUrl, nodeOperator]);

  return { exitRequests, getExitRequests, isLoading };
};

export default useGetExitRequests;
