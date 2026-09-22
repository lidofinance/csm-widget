import {
  OperatorRef,
  useFeeSplits,
  useOperatorBalance,
  useOperatorCurveId,
  useOperatorInfo,
  useOperatorRewards,
} from 'modules/web3';
import { calculateAvailableToClaim } from 'utils';
import { useKeysBreakdown } from './use-keys-breakdown';

export const useOperatorOverview = ({
  nodeOperatorId,
  module,
}: OperatorRef) => {
  const { data: keys, isPending: isKeysPending } = useKeysBreakdown({
    nodeOperatorId,
    module,
  });
  const { data: bond, isPending: isBondPending } = useOperatorBalance({
    nodeOperatorId,
    module,
  });
  const { data: rewards, isPending: isRewardsPending } = useOperatorRewards({
    nodeOperatorId,
    module,
  });
  const { data: feeSplits } = useFeeSplits({ nodeOperatorId, module });
  const { data: info } = useOperatorInfo({ nodeOperatorId, module });
  const { data: curve } = useOperatorCurveId({ nodeOperatorId, module });

  const availableToClaim = bond
    ? calculateAvailableToClaim({ bond, rewards, feeSplits })
    : undefined;

  return {
    keys,
    activeBalance: keys?.activeBalance,
    bond,
    rewards,
    availableToClaim,
    info,
    curve,
    isKeysPending,
    isBondPending,
    isRewardsPending,
  };
};
