import { useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';

const usePostTelegramData = ({
  userId,
  botToken,
}: {
  userId: number;
  botToken: string;
}) => {
  const { backendUrl } = useDappnodeUrls();
  const [postTgError, setPostTgError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isSuccess, setIsSuccess] = useState<boolean>();

  const errorMessages = {
    default:
      'Error while posting the Telegram data. Double-check the provided data.',
    chatNotFound:
      'Error setting Telegram data. Ensure to start the chat with your Bot and check your user ID.',
  };

  const postTelegramData = async () => {
    setIsLoading(true);
    setIsSuccess(false);
    try {
      setPostTgError(undefined);

      console.debug(`POSTing telegram data to events indexer API`);
      const response = await fetch(
        `${backendUrl}/api/v0/events_indexer/telegramConfig`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, token: botToken }),
        },
      );

      if (!response.ok) {
        const error = await response.json();

        if (error.error.includes('Bad Request: chat not found')) {
          setPostTgError(errorMessages.chatNotFound);
        } else {
          setPostTgError(errorMessages.default);
        }
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      localStorage.setItem('isTgSeen', 'true');
      setIsLoading(false);
      setIsSuccess(true);
    } catch (e) {
      console.error(`Error POSTing telegram data to events indexer API: ${e}`);
      setIsLoading(false);
    }
  };

  return { postTelegramData, postTgError, isLoading, isSuccess };
};

export default usePostTelegramData;
