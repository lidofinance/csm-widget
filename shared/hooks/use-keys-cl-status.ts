import { useLidoSWR } from '@lido-sdk/react';
import { useClApiUrl } from 'config/rpc/cl';
import { STRATEGY_CONSTANT } from 'consts/swr-strategies';
import { useCallback } from 'react';
import { HexString } from 'shared/keys';
import { KEY_STATUS } from 'types';
import { getSettledValue, standardFetcher } from 'utils';
import type { useNodeOperatorKeys } from './useNodeOperatorKeys';

const CL_METHOD = '/eth/v1/beacon/states/head/validators';
const MAX_URL_LENGTH = 2048;

type CLStatus =
  | 'pending_initialized'
  | 'pending_queued'
  | 'active_ongoing'
  | 'active_exiting'
  | 'active_slashed'
  | 'exited_unslashed'
  | 'exited_slashed'
  | 'withdrawal_possible'
  | 'withdrawal_done';

const StatusMap: Partial<Record<CLStatus, KEY_STATUS>> = {
  pending_queued: KEY_STATUS.ACTIVATION_PENDING,
  active_ongoing: KEY_STATUS.ACTIVE,
  active_exiting: KEY_STATUS.EXITING,
  active_slashed: KEY_STATUS.EXITING,
  exited_unslashed: KEY_STATUS.WITHDRAWAL_PENDING,
  exited_slashed: KEY_STATUS.WITHDRAWAL_PENDING,
  withdrawal_possible: KEY_STATUS.WITHDRAWAL_PENDING,
  withdrawal_done: KEY_STATUS.WITHDRAWAL_PENDING,
};

type Response = {
  execution_optimistic: boolean;
  finalized: boolean;
  data: [
    {
      index: string;
      balance: string;
      status: CLStatus;
      validator: {
        pubkey: HexString;
        withdrawal_credentials: HexString;
        effective_balance: string;
        slashed: boolean;
        activation_eligibility_epoch: string;
        activation_epoch: string;
        exit_epoch: string;
        withdrawable_epoch: string;
      };
    },
  ];
};

export type ClKeyStatus = {
  pubkey: HexString;
  status: KEY_STATUS;
  slashed: boolean;
};

export const useKeysCLStatus = (
  keys?: ReturnType<typeof useNodeOperatorKeys>['data'],
  config = STRATEGY_CONSTANT,
) => {
  const apiUrl = useClApiUrl();
  const url = `${apiUrl}${CL_METHOD}`;

  const fetcher = useCallback(async (): Promise<ClKeyStatus[]> => {
    const flatKeys = keys?.map(({ key }) => key);
    const countKeysPerChunk = getKeysPerChunk(url, flatKeys?.[0]?.length);
    const keysChunks = getChunks(flatKeys, countKeysPerChunk);

    const responses = await Promise.allSettled(
      keysChunks.map(async (keys) => {
        const resp = await standardFetcher<Response>(
          `${url}?id=${keys.join(encodeURIComponent(','))}`,
        );
        return resp.data.map(
          (key) =>
            StatusMap[key.status] &&
            ({
              pubkey: key.validator.pubkey,
              slashed: key.validator.slashed,
              status: StatusMap[key.status],
            } as ClKeyStatus),
        );
      }),
    );
    return responses.flatMap(getSettledValue).filter((i) => !!i);
  }, [keys, url]);

  return useLidoSWR(
    ['csm-cl-keys', apiUrl, keys],
    keys?.length ? fetcher : null,
    config,
  );
};

const getKeysPerChunk = (url: string, keyLength = 0) => {
  const maxKeysQueryLength = MAX_URL_LENGTH - url.length - 4; // '?id='.length
  return Math.floor(
    (maxKeysQueryLength + 3) / (keyLength + 3), // 3 = encodeURIComponent(',').length
  );
};

const getChunks = (arr: string[] = [], max: number) =>
  Array.from({ length: Math.ceil(arr.length / max) })
    .fill(null)
    .map((_, index) => arr.slice(index * max, (index + 1) * max));
