import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import {
  BondRewards1,
  BondRewards2,
  BondRewards3,
  BondRewards4,
  BondRewards5,
  Keys1,
  Keys10,
  Keys11,
  Keys12,
  Keys13,
  Keys14,
  Keys15,
  Keys16,
  Keys2,
  Keys3,
  Keys4,
  Keys5,
  Keys6,
  Keys7,
  Keys8,
  Keys9,
  LockedBond1,
  LockedBond2,
  LockedBond3,
  Main1,
  Main2,
  Main3,
  Main4,
  Main5,
  Main6,
  Main7,
  Main8,
  Monitoring1,
  Monitoring2,
  Monitoring3,
  Monitoring4,
  Monitoring5,
  OperatorType1,
  OperatorType2,
  Roles1,
  Roles2,
  Roles3,
  Roles4,
  Roles5,
  Roles6,
  Roles7,
} from './items';
import {
  CmBondRewards1,
  CmBondRewards2,
  CmBondRewards3,
  CmBondRewards4,
  CmKeys1,
  CmKeys10,
  CmKeys2,
  CmKeys3,
  CmKeys4,
  CmKeys5,
  CmKeys6,
  CmKeys7,
  CmKeys8,
  CmKeys9,
  CmLockedBond1,
  CmLockedBond2,
  CmLockedBond3,
  CmMain1,
  CmMain2,
  CmMain3,
  CmOperatorType1,
  CmOperatorType2,
  CmRoles1,
  CmRoles2,
  CmRoles3,
  CmRoles4,
  CmRoles5,
} from './items-cm';

const FAQ_OPERATOR_TYPE_CSM = [OperatorType1, OperatorType2];
const FAQ_OPERATOR_TYPE_CM = [CmOperatorType1, CmOperatorType2];

const FAQ_ROLES_CSM = [Roles1, Roles2, Roles3, Roles4, Roles5, Roles6, Roles7];
const FAQ_ROLES_CM = [CmRoles1, CmRoles2, CmRoles3, CmRoles4, CmRoles5];

const FAQ_BOND_CSM = [
  BondRewards1,
  BondRewards2,
  BondRewards3,
  BondRewards4,
  BondRewards5,
];
const FAQ_BOND_CM = [
  CmBondRewards1,
  CmBondRewards2,
  CmBondRewards3,
  CmBondRewards4,
];

const FAQ_LOCKED_CSM = [LockedBond1, LockedBond2, LockedBond3];
const FAQ_LOCKED_CM = [CmLockedBond1, CmLockedBond2, CmLockedBond3];

const FAQ_MAIN_CSM = [Main1, Main2, Main3, Main4, Main5, Main6, Main7, Main8];
const FAQ_MAIN_CM = [CmMain1, CmMain2, CmMain3];

const FAQ_MONITORING_CSM = [
  Monitoring1,
  Monitoring2,
  Monitoring3,
  Monitoring4,
  Monitoring5,
];
const FAQ_MONITORING_CM: typeof FAQ_MONITORING_CSM = [];

const FAQ_KEYS_CSM = [
  Keys1,
  Keys2,
  Keys3,
  Keys4,
  Keys5,
  Keys6,
  Keys16,
  Keys7,
  Keys8,
  Keys9,
  Keys10,
  Keys11,
  Keys12,
  Keys13,
  Keys14,
  Keys15,
];
const FAQ_KEYS_CM = [
  CmKeys1,
  CmKeys2,
  CmKeys3,
  CmKeys4,
  CmKeys10,
  CmKeys5,
  CmKeys6,
  CmKeys7,
  CmKeys8,
  CmKeys9,
];

const CSM_FAQ = {
  OPERATOR_TYPE: FAQ_OPERATOR_TYPE_CSM,
  ROLES: FAQ_ROLES_CSM,
  BOND: FAQ_BOND_CSM,
  LOCKED: FAQ_LOCKED_CSM,
  MAIN: FAQ_MAIN_CSM,
  MONITORING: FAQ_MONITORING_CSM,
  KEYS: FAQ_KEYS_CSM,
};
const CM_FAQ = {
  OPERATOR_TYPE: FAQ_OPERATOR_TYPE_CM,
  ROLES: FAQ_ROLES_CM,
  BOND: FAQ_BOND_CM,
  LOCKED: FAQ_LOCKED_CM,
  MAIN: FAQ_MAIN_CM,
  MONITORING: FAQ_MONITORING_CM,
  KEYS: FAQ_KEYS_CM,
};

export type FaqSection = keyof typeof CSM_FAQ;

export const FAQ_BY_MODULE = {
  [MODULE_NAME.CSM]: CSM_FAQ,
  [MODULE_NAME.CSM_02]: CSM_FAQ,
  [MODULE_NAME.CM]: CM_FAQ,
};

export { useFaq } from './use-faq';
