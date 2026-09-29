import { KeyWithStatus } from '@lidofinance/lido-csm-sdk';
import { useQueries } from '@tanstack/react-query';
import { operatorKeysQueryOptions, useLidoSDK } from 'modules/web3';
import { ModuleNodeOperator } from 'modules/web3/operator-provider/types';
import { selectKeysBreakdown } from 'utils';
import { useMyOperators } from './use-my-operators';

const EMPTY: ModuleNodeOperator[] = [];
const hasIssues = (keys: KeyWithStatus[]) =>
  selectKeysBreakdown(keys).issuesCount > 0;

/** Operators whose keys have issues; keys-only so the nav counter stays cheap on every route. */
export const useMyOperatorsIssues = () => {
  const { sm } = useLidoSDK();
  const { data: operators = EMPTY } = useMyOperators();
  return useQueries({
    queries: operators.map((op) => ({
      ...operatorKeysQueryOptions({
        sdk: sm[op.module],
        nodeOperatorId: op.nodeOperatorId,
      }),
      select: hasIssues,
    })),
    combine: (results) => operators.filter((_, i) => results[i]?.data),
  });
};
