import { MODULE_NAME, SUPPORTED_CHAINS } from '@lidofinance/lido-csm-sdk';
import { resolveModuleOverride } from './resolve-module-override';

const HOODI = 560048 as SUPPORTED_CHAINS;
const UNDEPLOYED_CHAIN = 17000 as SUPPORTED_CHAINS;

describe('resolveModuleOverride', () => {
  it('accepts lowercase module deployed on the chain', () => {
    expect(resolveModuleOverride('cm', HOODI)).toBe(MODULE_NAME.CM);
  });

  it('rejects CSM_02, which is not a deployment module', () => {
    expect(resolveModuleOverride('CSM_02', HOODI)).toBeUndefined();
  });

  it('rejects a module not deployed on the chain', () => {
    expect(resolveModuleOverride('CM', UNDEPLOYED_CHAIN)).toBeUndefined();
  });

  it.each([undefined, null, '', 'default', 'garbage', 42])(
    'rejects %p',
    (candidate) => {
      expect(resolveModuleOverride(candidate, HOODI)).toBeUndefined();
    },
  );
});
