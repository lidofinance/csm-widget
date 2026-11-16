import {
  useCustomRewardsClaimer,
  useFeeSplits,
  useNodeOperatorId,
} from 'modules/web3';
import { zeroAddress } from 'viem';

export const useHeaderFlags = () => {
  const nodeOperatorId = useNodeOperatorId();
  const { data: claimer } = useCustomRewardsClaimer({ nodeOperatorId });
  const { data: splits } = useFeeSplits({ nodeOperatorId });

  return {
    claimerOn: !!claimer && claimer !== zeroAddress,
    splittersOn: (splits?.length ?? 0) > 0,
  };
};
