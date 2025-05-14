import { useLidoSWR } from '@lido-sdk/react';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCallback } from 'react';
import {
  useCSAccountingVersionedRPC,
  useCSModuleVersionedRPC,
} from './useCsmContracts';

const onSuccess = () => false;
const onError = (error: unknown) => {
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'CALL_EXCEPTION'
  )
    return true;
  throw error;
};

export const useCsmVersionSupported = () => {
  const csModule = useCSModuleVersionedRPC();
  const csAccounting = useCSAccountingVersionedRPC();

  const fetcher = useCallback(async () => {
    const result = await Promise.all([
      csModule.getInitializedVersion().then(onSuccess, onError),
      csAccounting.getInitializedVersion().then(onSuccess, onError),
    ]);
    return !result.every(Boolean);
  }, [csAccounting, csModule]);

  return useLidoSWR(['csm-version'], fetcher, STRATEGY_CONSTANT);
};
