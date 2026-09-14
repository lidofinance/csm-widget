import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  hasOperatorRole,
  useAvailableOperators,
  useDappStatus,
} from 'modules/web3';

export const useHasOperatorIn = (module: MODULE_NAME) => {
  const { isAccountActive, address } = useDappStatus();
  const { data, isPending } = useAvailableOperators();
  return {
    hasOperator: !!data?.some(
      (operator) =>
        operator.module === module && hasOperatorRole(operator, address),
    ),
    isPending: isAccountActive && isPending,
  };
};
