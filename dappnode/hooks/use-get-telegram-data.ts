import { useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';

const useGetTelegramData = () => {
  const { backendUrl } = useDappnodeUrls();
  const [telegramId, setTelegramData] = useState();
  const [botToken, setBotToken] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const getTelegramData = async () => {
    setIsLoading(true);
    try {
      console.debug(`GETting telegram data from events indexer API`);
      const response = await fetch(
        `${backendUrl}/api/v0/events_indexer/telegramConfig`,
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
      setTelegramData(data.userId);
      setBotToken(data.token);
      setIsLoading(false);
    } catch (e) {
      console.error(
        `Error GETting telegram data from events indexer API: ${e}`,
      );
      setIsLoading(false);
    }
  };

  return { telegramId, botToken, getTelegramData, isLoading };
};

export default useGetTelegramData;
