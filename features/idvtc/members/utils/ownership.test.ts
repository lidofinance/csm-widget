import { generateMemberOwnershipMessage } from './ownership';

describe('generateMemberOwnershipMessage', () => {
  it('lowercases the address and embeds the operator key', () => {
    expect(
      generateMemberOwnershipMessage(
        '0xABCDef0000000000000000000000000000000001',
        'csm-42',
      ),
    ).toBe(
      'Verify ownership of address 0xabcdef0000000000000000000000000000000001 for IDVTC operator csm-42',
    );
  });
});
