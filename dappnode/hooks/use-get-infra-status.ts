import { useEffect, useState } from 'react';
import useDappnodeUrls from './use-dappnode-urls';
import { INFRA_STATUS } from 'dappnode/status/types';

export const useGetInfraStatus = () => {
  const { ECApiUrl, CCStatusApiUrl, CCVersionApiUrl } = useDappnodeUrls();
  const [ECStatus, setECStatus] = useState<INFRA_STATUS>();
  const [CCStatus, setCCStatus] = useState<INFRA_STATUS>();

  const [ECName, setECName] = useState<string>();
  const [CCName, setCCName] = useState<string>();

  const [isECLoading, setIsECLoading] = useState<boolean>(true);
  const [isCCLoading, setIsCCLoading] = useState<boolean>(true);

  useEffect(() => {
    const getCCData = async () => {
      setIsCCLoading(true);
      try {
        const versionResponse = await fetch(CCVersionApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!versionResponse.ok) {
          throw new Error(`HTTP error! Status: ${versionResponse.status}`);
        }
        const versionData = await versionResponse.json();
        setCCName(versionData.data.version.split('/')[0]);

        const syncResponse = await fetch(CCStatusApiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!syncResponse.ok) {
          throw new Error(`HTTP error! Status: ${syncResponse.status}`);
        }

        const data = await syncResponse.json();
        setCCStatus(data.data.is_syncing ? 'SYNCING' : 'SYNCED');
        setIsCCLoading(false);
      } catch (e) {
        console.error(`Error getting CC data: ${e}`);
        setCCStatus('NOT_INSTALLED');
        setIsCCLoading(false);
      }
    };

    const getECData = async () => {
      setIsECLoading(true);
      try {
        const versionResponse = await fetch(`${ECApiUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'web3_clientVersion',
            params: [],
            id: 1,
          }),
        });

        if (!versionResponse.ok) {
          throw new Error(`HTTP error! Status: ${versionResponse.status}`);
        }
        const versionData = await versionResponse.json();
        setECName(versionData.result.split('/')[0]);

        const syncResponse = await fetch(`${ECApiUrl}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            jsonrpc: '2.0',
            method: 'eth_syncing',
            params: [],
            id: 0,
          }),
        });

        if (!syncResponse.ok) {
          throw new Error(`HTTP error! Status: ${syncResponse.status}`);
        }

        const syncData = await syncResponse.json();
        setECStatus(syncData.result ? 'SYNCING' : 'SYNCED');
        setIsECLoading(false);
      } catch (e) {
        console.error(`Error getting EC data: ${e}`);
        setECStatus('NOT_INSTALLED');
        setIsECLoading(false);
      }
    };

    void getECData();
    void getCCData();
  }, [CCStatusApiUrl, CCVersionApiUrl, ECApiUrl]);

  return {
    CCName,
    CCStatus,
    ECName,
    ECStatus,
    isECLoading,
    isCCLoading,
  };
};
