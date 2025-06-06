import { useCsmStatus, useDappStatus, useNodeOperatorId } from 'modules/web3';
import { useMemo } from 'react';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useCsmStatus();

  return useMemo(
    () => Boolean(isAccountActive && !nodeOperatorId && !status?.isPaused),
    [isAccountActive, nodeOperatorId, status?.isPaused],
  );
};
