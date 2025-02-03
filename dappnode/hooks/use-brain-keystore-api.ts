import { useState, useEffect, useCallback } from 'react';
import useDappnodeUrls from './use-dappnode-urls';

const useApiBrain = (interval = 60000) => {
  const { brainKeysUrl } = useDappnodeUrls();

  const [pubkeys, setPubkeys] = useState<string[]>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<unknown>();

  const fetchPubkeys = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(brainKeysUrl, { method: 'GET' });

      if (response.ok) {
        const data = await response.json();
        setPubkeys(data.lido || []);
        setError(undefined);
      } else {
        console.error('Error fetching brain keys:', response);
        setError(response);
      }
    } catch (e) {
      console.error(e);
      setError(e);
    } finally {
      setIsLoading(false);
    }
  }, [brainKeysUrl]);

  useEffect(() => {
    void fetchPubkeys();

    const intervalId = setInterval(() => {
      void fetchPubkeys();
    }, interval);

    return () => clearInterval(intervalId);
  }, [fetchPubkeys, interval]);

  return { pubkeys, isLoading, error };
};

export default useApiBrain;
