import { useEffect, useState } from 'react';
import { DepositData } from 'types';
import useApiBrain from './use-brain-keystore-api';

const useCheckImportedDepositKeys = (depositData: DepositData[]) => {
  const { pubkeys: brainKeys, isLoading: brainKeysLoading } = useApiBrain();

  const [keysLoading, setKeysLoading] = useState<boolean>(false);

  const [keysInDeposit, setKeysInDeposit] = useState<string[]>([]);
  const [missingKeys, setMissingKeys] = useState<string[]>([]);

  useEffect(() => {
    const keys = [];
    for (const key of depositData) {
      keys.push(key.pubkey);
    }
    setKeysInDeposit(keys);
  }, [depositData]);

  useEffect(() => {
    if (brainKeysLoading) {
      setKeysLoading(true);
    } else {
      setKeysLoading(false);
    }
  }, [brainKeysLoading]);

  // Filtering lido keys by status and brain imported
  useEffect(() => {
    const missingEntries: string[] = [];
    if (brainKeys) {
      const formattedBrainKeys = brainKeys.map((key) => key.toLowerCase());

      for (const key of keysInDeposit) {
        if (!formattedBrainKeys.includes('0x' + key)) {
          missingEntries.push(key);
        }
      }
    } else {
      for (const key of keysInDeposit) {
        missingEntries.push(key);
      }
    }
    setMissingKeys(missingEntries);
  }, [keysInDeposit, brainKeys]);

  return { missingKeys, keysLoading };
};

export default useCheckImportedDepositKeys;
