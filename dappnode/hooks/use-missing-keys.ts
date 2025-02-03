import { useEffect, useState } from 'react';
import { useKeysWithStatus } from 'shared/hooks';
import useApiBrain from './use-brain-keystore-api';
import useDappnodeUrls from './use-dappnode-urls';

const useMissingKeys = () => {
  const [missingKeys, setMissingKeys] = useState<string[]>([]);
  const [keysLoading, setKeysLoading] = useState<boolean>(false);

  const {
    pubkeys: brainKeys,
    isLoading: brainKeysLoading,
    error,
  } = useApiBrain();
  const { data: lidoKeys, initialLoading: lidoKeysLoading } =
    useKeysWithStatus();

  const { keysStatusUrl } = useDappnodeUrls();

  useEffect(() => {
    if (lidoKeysLoading || brainKeysLoading) {
      setKeysLoading(true);
    } else {
      setKeysLoading(false);
    }
  }, [lidoKeysLoading, brainKeysLoading]);

  useEffect(() => {
    const setActiveKeys = async (missingKeys_: string[]): Promise<void> => {
      if (missingKeys_.length > 0) {
        const params = new URLSearchParams({
          id: missingKeys_.join(','),
          status:
            'withdrawal_done,withdrawal_possible,exited_unslashed,exited_slashed',
        });

        const inactiveKeys: string[] = [];
        try {
          const response = await fetch(
            `${keysStatusUrl}?${params.toString()}`,
            {
              method: 'GET',
            },
          );

          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }

          const data = await response.json();

          for (const key of data.data) {
            inactiveKeys.push(key.validator.pubkey);
          }

          const lidoActiveKeys = missingKeys_.filter(
            (key) => !inactiveKeys.includes(key),
          );

          setMissingKeys(lidoActiveKeys);
        } catch (error) {
          console.error('Error fetching validators:', error);
        }
      } else {
        setMissingKeys([]);
      }
    };

    const filterLidoKeys = async () => {
      if (lidoKeys) {
        const formattedLidoKeys = [];
        for (const key of lidoKeys) {
          formattedLidoKeys.push(key.key.toLowerCase());
        }

        const formattedBrainKeys = brainKeys
          ? brainKeys.map((key) => key.toLowerCase())
          : [];

        const missingLidoKeys = formattedLidoKeys.filter(
          (lidoKey) => !formattedBrainKeys.includes(lidoKey),
        );

        await setActiveKeys(missingLidoKeys);
      }
    };

    if (brainKeys && lidoKeys) {
      void filterLidoKeys();
    }
  }, [brainKeys, keysStatusUrl, lidoKeys]);

  return { missingKeys, keysLoading, error };
};

export default useMissingKeys;
