import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useAvailableOperators, useDappStatus } from 'modules/web3';

export const useHasOperatorIn = (module: MODULE_NAME) => {
  const { isAccountActive } = useDappStatus();
  const { data, isPending } = useAvailableOperators();
  return {
    hasOperator: !!data?.some((operator) => operator.module === module),
    isPending: isAccountActive && isPending,
  };
};
