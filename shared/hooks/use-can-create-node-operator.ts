import { useCsmStatus, useDappStatus, useNodeOperatorId } from 'modules/web3';
import { useEffect, useState } from 'react';

export const useCanCreateNodeOperator = () => {
  const { isAccountActive } = useDappStatus();
  const nodeOperatorId = useNodeOperatorId();
  const { data: status } = useCsmStatus();

  const [value, setValue] = useState(false);

  useEffect(() => {
    const value = Boolean(
      isAccountActive && !nodeOperatorId && !status?.isPaused,
    );
    setValue(value);
  }, [isAccountActive, nodeOperatorId, status?.isPaused]);

  return value;
};
