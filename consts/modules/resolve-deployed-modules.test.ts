import { MODULE_NAME } from '@lidofinance/lido-csm-sdk';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';
import { resolveDeployedModules } from './resolve-deployed-modules';

describe('resolveDeployedModules', () => {
  it('returns every module configured on the chain, CSM first', () => {
    expect(resolveDeployedModules(CHAINS.Mainnet)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CSM_02,
      MODULE_NAME.CM,
    ]);
    expect(resolveDeployedModules(CHAINS.Hoodi)).toEqual([
      MODULE_NAME.CSM,
      MODULE_NAME.CSM_02,
      MODULE_NAME.CM,
    ]);
  });

  it('returns an empty list for an unknown chain', () => {
    expect(resolveDeployedModules(999999)).toEqual([]);
  });
});
