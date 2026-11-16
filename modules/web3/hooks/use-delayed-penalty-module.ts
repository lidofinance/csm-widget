import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { useModule } from '../operator-provider/use-module';
import { useHasReportDelayedPenaltyRole } from './use-has-report-delayed-penalty-role';

/** Active module if it grants the report role, else the first module that does. */
export const useDelayedPenaltyModule = (): MODULE_NAME | undefined => {
  const { module: activeModule } = useModule();
  const { data: grantingModules } = useHasReportDelayedPenaltyRole();

  if (activeModule && grantingModules?.includes(activeModule)) {
    return activeModule;
  }
  return grantingModules?.[0];
};
