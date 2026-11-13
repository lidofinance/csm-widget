import { useModule, useNodeOperatorId } from 'modules/web3';
import { useOperatorInfo } from 'modules/web3/hooks/use-operator-info';

export const useNeedsNormalize = (): boolean => {
  const { isCsmFamily } = useModule();
  const nodeOperatorId = useNodeOperatorId();
  const { data: info } = useOperatorInfo({ nodeOperatorId });

  return (
    isCsmFamily &&
    !!info &&
    info.enqueuedCount < info.depositableValidatorsCount
  );
};
