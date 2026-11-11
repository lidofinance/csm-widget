import {
  MODULE_NAME,
  NodeOperatorId,
  SmSDKFor,
} from '@lidofinance/lido-csm-sdk';
import { queryOptions, useQuery } from '@tanstack/react-query';
import { STRATEGY_CONSTANT } from 'consts';
import invariant from 'tiny-invariant';
import { useSmSDK } from '../web3-provider';

export const KEY_OPERATOR_GROUP_SUMMARY = ['operator-group-summary'];

export const operatorGroupStakeSummaryQueryOptions = ({
  sdk,
  nodeOperatorId,
}: {
  sdk: SmSDKFor<MODULE_NAME.CM> | undefined;
  nodeOperatorId: NodeOperatorId | undefined;
}) =>
  queryOptions({
    queryKey: [
      ...KEY_OPERATOR_GROUP_SUMMARY,
      { nodeOperatorId, module: MODULE_NAME.CM },
    ],
    ...STRATEGY_CONSTANT,
    queryFn: async () => {
      invariant(sdk);
      invariant(nodeOperatorId !== undefined);
      return sdk.metaRegistry.getOperatorGroupStakeSummary(nodeOperatorId);
    },
    enabled: !!sdk && nodeOperatorId !== undefined,
  });

export const useOperatorGroupStakeSummary = ({
  nodeOperatorId,
  module,
}: {
  nodeOperatorId: NodeOperatorId | undefined;
  module: MODULE_NAME | undefined;
}) => {
  const sdk = useSmSDK(MODULE_NAME.CM);

  return useQuery(
    operatorGroupStakeSummaryQueryOptions({
      sdk,
      nodeOperatorId: module === MODULE_NAME.CM ? nodeOperatorId : undefined,
    }),
  );
};
