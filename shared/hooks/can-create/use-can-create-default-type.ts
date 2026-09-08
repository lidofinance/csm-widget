import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useDappStatus } from 'modules/web3';
import { useHasOperatorIn } from './use-has-operator-in';
import { useModuleOpen } from './use-module-open';

export const useCanCreateDefaultType = (module: MODULE_NAME) => {
  const { isAccountActive } = useDappStatus();
  const { isOpen, isPending: isModulePending } = useModuleOpen(module);
  const { hasOperator, isPending: isOperatorPending } =
    useHasOperatorIn(module);
  return {
    canCreate: isAccountActive && isOpen && !hasOperator,
    isPending: isModulePending || isOperatorPending,
  };
};
