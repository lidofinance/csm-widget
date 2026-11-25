import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { isCsmFamilyModule } from 'consts/modules';

export type CreateRows = {
  canCreateCm: boolean;
  cmTypes: string[];
  csmTypes: string[];
  hasRows: boolean;
};

export const filterCreateRows = (
  rows: CreateRows,
  modules: MODULE_NAME[],
): CreateRows => {
  const canCreateCm = rows.canCreateCm && modules.includes(MODULE_NAME.CM);
  const cmTypes = canCreateCm ? rows.cmTypes : [];
  const csmTypes = modules.some(isCsmFamilyModule) ? rows.csmTypes : [];

  return {
    canCreateCm,
    cmTypes,
    csmTypes,
    hasRows: canCreateCm || csmTypes.length > 0,
  };
};
