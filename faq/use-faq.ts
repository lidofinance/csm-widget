import { useModule } from 'modules/web3';
import {
  FAQ_BOND_CM,
  FAQ_BOND_CSM,
  FAQ_KEYS_CM,
  FAQ_KEYS_CSM,
  FAQ_LOCKED_CM,
  FAQ_LOCKED_CSM,
  FAQ_MAIN_CM,
  FAQ_MAIN_CSM,
  FAQ_MONITORING_CM,
  FAQ_MONITORING_CSM,
  FAQ_OPERATOR_TYPE_CM,
  FAQ_OPERATOR_TYPE_CSM,
  FAQ_ROLES_CM,
  FAQ_ROLES_CSM,
} from './index';

// Selects the operator-facing FAQ sets by the active operator's module.
// `undefined` module (no active operator) falls back to the CSM baseline.
export const useFaq = () => {
  const { isCM } = useModule();

  return {
    FAQ_OPERATOR_TYPE: isCM ? FAQ_OPERATOR_TYPE_CM : FAQ_OPERATOR_TYPE_CSM,
    FAQ_ROLES: isCM ? FAQ_ROLES_CM : FAQ_ROLES_CSM,
    FAQ_BOND: isCM ? FAQ_BOND_CM : FAQ_BOND_CSM,
    FAQ_LOCKED: isCM ? FAQ_LOCKED_CM : FAQ_LOCKED_CSM,
    FAQ_MAIN: isCM ? FAQ_MAIN_CM : FAQ_MAIN_CSM,
    FAQ_MONITORING: isCM ? FAQ_MONITORING_CM : FAQ_MONITORING_CSM,
    FAQ_KEYS: isCM ? FAQ_KEYS_CM : FAQ_KEYS_CSM,
  };
};
