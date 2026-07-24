import { keepsManageRole } from './keeps-manage-role';

const ADDRESS = '0xAbCd000000000000000000000000000000000001';
const OTHER = '0x1111000000000000000000000000000000000002';

describe('keepsManageRole', () => {
  it('true when custom addresses are not specified', () => {
    expect(keepsManageRole({ specifyCustomAddresses: false }, ADDRESS)).toBe(
      true,
    );
  });

  it('true when the custom manager address is the connected address (case-insensitive)', () => {
    expect(
      keepsManageRole(
        {
          specifyCustomAddresses: true,
          managerAddress: ADDRESS.toLowerCase(),
          rewardsAddress: OTHER,
        },
        ADDRESS,
      ),
    ).toBe(true);
  });

  it('true when the custom rewards address is the connected address', () => {
    expect(
      keepsManageRole(
        {
          specifyCustomAddresses: true,
          managerAddress: OTHER,
          rewardsAddress: ADDRESS,
        },
        ADDRESS,
      ),
    ).toBe(true);
  });

  it('false when both custom addresses point elsewhere', () => {
    expect(
      keepsManageRole(
        {
          specifyCustomAddresses: true,
          managerAddress: OTHER,
          rewardsAddress: OTHER,
        },
        ADDRESS,
      ),
    ).toBe(false);
  });

  it('true when a custom address is left empty (role defaults to the creator)', () => {
    expect(
      keepsManageRole(
        {
          specifyCustomAddresses: true,
          managerAddress: '',
          rewardsAddress: OTHER,
        },
        ADDRESS,
      ),
    ).toBe(true);
  });
});
