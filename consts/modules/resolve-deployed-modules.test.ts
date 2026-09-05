import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';
import { resolveDeployedModules } from './resolve-deployed-modules';

describe('resolveDeployedModules', () => {
  it('secondary modules are filtered by MODULE_CONFIG', () => {
    expect(resolveDeployedModules(MODULE_NAME.CSM, CHAINS.Mainnet)).toEqual([
      MODULE_NAME.CSM,
    ]);
    expect(resolveDeployedModules(MODULE_NAME.CSM, CHAINS.Hoodi)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CSM_02,
    ]);
  });

  it('CM deployment is always exactly [CM]', () => {
    expect(resolveDeployedModules(MODULE_NAME.CM, CHAINS.Hoodi)).toEqual([
      MODULE_NAME.CM,
    ]);
  });

  it('CSM_02 deployment is always exactly [CSM_02], even without a MODULE_CONFIG entry', () => {
    expect(resolveDeployedModules(MODULE_NAME.CSM_02, CHAINS.Mainnet)).toEqual([
      MODULE_NAME.CSM_02,
    ]);
  });

  it('primary module is always first and always present', () => {
    const result = resolveDeployedModules(MODULE_NAME.CSM, 999999);
    expect(result).toEqual([MODULE_NAME.CSM]);
  });
});
