import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { operatorGroupIdQueryOptions } from 'modules/web3/hooks/use-operator-group-id';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { useSmSDK } from 'modules/web3/web3-provider';
import type { GroupIdResult } from './partition-roster';

export const useMyGroupIds = (cmOps: readonly ModuleNodeOperator[]) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  const queries = useQueries({
    queries: cmOps.map((op) =>
      operatorGroupIdQueryOptions({ sdk, nodeOperatorId: op.nodeOperatorId }),
    ),
  });

  const stamp = queries
    .map((q) => `${q.status}:${q.dataUpdatedAt}:${q.errorUpdatedAt}`)
    .join(',');

  const warned = useRef(new Set<string>());
  useEffect(() => {
    queries.forEach((q, i) => {
      const id = cmOps[i]?.nodeOperatorId;
      const key = `${id}:${q.errorUpdatedAt}`;
      if (q.isError && !warned.current.has(key)) {
        warned.current.add(key);
        console.warn('Failed to load the group of CM operator', id, q.error);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stamp]);

  const isPending = cmOps.length > 0 && queries.some((q) => q.isPending);

  const groupIds = useMemo(() => {
    const map = new Map<bigint, GroupIdResult>();
    cmOps.forEach((op, i) => {
      const q = queries[i];
      if (!q || q.isPending) return;
      map.set(op.nodeOperatorId, q.isError ? 'error' : (q.data ?? null));
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cmOps, stamp]);

  return { groupIds, isPending };
};
