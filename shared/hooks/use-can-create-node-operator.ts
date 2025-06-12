import { useCsmStatus, useDappStatus, useNodeOperatorId } from 'modules/web3';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useCsmStatus();

  return Boolean(
    isAccountActive && nodeOperatorId === undefined && !status?.isPaused,
  );
};
