import { useEffect, useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';
import { AllowedRelay } from 'dappnode/status/types';
import { sanitizeUrl } from 'dappnode/utils/sanitize-urls';

const useGetRelaysData = () => {
  const { backendUrl, MEVApiUrl } = useDappnodeUrls();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [allowedRelays, setAllowedRelays] = useState<AllowedRelay[]>();
  const [usedRelays, setUsedRelays] = useState<[]>();
  const [relaysError, setRelaysError] = useState<unknown>();
  const [isMEVRunning, setIsMEVRunning] = useState<boolean>();
  const [mandatoryRelays, setMandatoryRelays] = useState<AllowedRelay[]>();
  const [hasMandatoryRelay, setHasMandatoryRelay] = useState<boolean>();
  const [usedBlacklistedRelays, setUsedBlacklistedRelays] = useState<string[]>(
    [],
  );

  useEffect(() => {
    const getMEVStatus = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(MEVApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        await response.json();
        setIsMEVRunning(true);
        setIsLoading(false);
      } catch (e) {
        setIsMEVRunning(false);
        console.error('Error GETting MEV PKG Status:', e);
        setIsLoading(false);
      }
    };

    void getMEVStatus();
  }, [MEVApiUrl]);

  useEffect(() => {
    const getAllowedRelays = async () => {
      try {
        console.debug(`GETting allowed relays from events indexer API`);
        const response = await fetch(
          `${backendUrl}/api/v0/events_indexer/relays_allowed`,
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

        const cleanedData = data.map((relay: { Uri: string }) => ({
          ...relay,
          Uri: sanitizeUrl(relay.Uri),
        }));

        setAllowedRelays(cleanedData);
      } catch (e) {
        console.error(`Error GETting allowed relays from indexer API: ${e}`);
      }
    };

    const getUsedRelays = async () => {
      try {
        console.debug(`GETting used relays from events indexer API`);
        const response = await fetch(
          `${backendUrl}/api/v0/events_indexer/relays_used`,
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

        const cleanedData = data.map((url: string) => sanitizeUrl(url));
        setUsedRelays(cleanedData);
      } catch (e) {
        setRelaysError(e);
        console.error(`Error GETting used relays from indexer API: ${e}`);
      }
    };

    void getAllowedRelays();
    void getUsedRelays();
  }, [isMEVRunning, backendUrl]);

  useEffect(() => {
    if (allowedRelays) {
      setMandatoryRelays(allowedRelays.filter((relay) => relay.IsMandatory));
    }
  }, [allowedRelays]);

  useEffect(() => {
    const filterMandatoryRelays = (
      mandatoryRelays: AllowedRelay[],
      usedRelays: string[],
    ) => {
      return usedRelays.some((usedRelay) =>
        mandatoryRelays.some((relay) => relay.Uri === usedRelay),
      );
    };

    if (mandatoryRelays && usedRelays) {
      const hasMandatoryRelay = filterMandatoryRelays(
        mandatoryRelays,
        usedRelays,
      );
      setHasMandatoryRelay(hasMandatoryRelay);
    }
  }, [mandatoryRelays, usedRelays]);

  useEffect(() => {
    if (allowedRelays && usedRelays) {
      const allowedUris = allowedRelays.map((relay) => relay.Uri);

      // Filter out uris from usedRelays that are not in allowedRelays
      const blacklisted = usedRelays.filter(
        (uri) => !allowedUris.includes(uri),
      );

      setUsedBlacklistedRelays(blacklisted);
    }
  }, [usedRelays, allowedRelays]);

  return {
    allowedRelays,
    usedRelays,
    relaysError,
    isMEVRunning,
    hasMandatoryRelay,
    mandatoryRelays,
    isLoading,
    usedBlacklistedRelays,
  };
};

export default useGetRelaysData;
