import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { deployedModules } from 'consts';
import { useCuratedGatesEligibility, useDappStatus } from 'modules/web3';
import { useModuleOpen } from './use-module-open';

export const useCanCreateCM = () => {
  const { isAccountActive } = useDappStatus();
  const cm = useModuleOpen(MODULE_NAME.CM);
  const { data: gatesCount, isPending: isGatesPending } =
    useCuratedGatesEligibility(undefined, (data) => data.length);
  return {
    canCreate: isAccountActive && cm.isOpen && !!gatesCount,
    isPending:
      cm.isPending ||
      (deployedModules.includes(MODULE_NAME.CM) && isGatesPending),
  };
};
