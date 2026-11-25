import { getCreateHoldStage } from './create-hold-stage';

describe('getCreateHoldStage', () => {
  it('ends on the modal success without a decoded result', () => {
    expect(
      getCreateHoldStage({
        hasResult: false,
        stagedFiles: 2,
        willInitMembers: true,
      }),
    ).toBe('created-without-id');
  });

  it('holds on the DKG upload when files are staged', () => {
    expect(
      getCreateHoldStage({
        hasResult: true,
        stagedFiles: 2,
        willInitMembers: true,
      }),
    ).toBe('dkg-upload');
  });

  it('holds on the members init when no files are staged', () => {
    expect(
      getCreateHoldStage({
        hasResult: true,
        stagedFiles: 0,
        willInitMembers: true,
      }),
    ).toBe('members-init');
  });

  it('stays on the pending stage until the flow shows the success screen', () => {
    expect(
      getCreateHoldStage({
        hasResult: true,
        stagedFiles: 0,
        willInitMembers: false,
      }),
    ).toBe('pending');
  });
});
