import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';
import { resolveDeployedModules } from './resolve-deployed-modules';

describe('resolveDeployedModules', () => {
  it('CSM deployment includes CSM_02 on Hoodi but not on Mainnet', () => {
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

  it('primary module is always first and always present', () => {
    const result = resolveDeployedModules(MODULE_NAME.CSM, 999999);
    expect(result[0]).toBe(MODULE_NAME.CSM);
  });
});
