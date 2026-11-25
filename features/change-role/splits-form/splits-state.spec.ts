import {
  getSplitsActionLabel,
  getSplitsNotice,
  getSplitsStageTexts,
  getSplitsSubmitLabel,
  splitsEqual,
} from './splits-state';

const A = '0xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
const B = '0xbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb';

describe('splitsEqual', () => {
  const current = [
    { recipient: A, share: 2000n },
    { recipient: B, share: 3000n },
  ] as const;

  it('matches recipients case-insensitively', () => {
    expect(
      splitsEqual(
        [
          { recipient: A.toLowerCase() as typeof A, share: 2000n },
          { recipient: B, share: 3000n },
        ],
        [...current],
      ),
    ).toBe(true);
  });

  it('is order-sensitive', () => {
    expect(
      splitsEqual(
        [
          { recipient: B, share: 3000n },
          { recipient: A, share: 2000n },
        ],
        [...current],
      ),
    ).toBe(false);
  });

  it('differs on a share or length change', () => {
    expect(
      splitsEqual(
        [
          { recipient: A, share: 2500n },
          { recipient: B, share: 3000n },
        ],
        [...current],
      ),
    ).toBe(false);
    expect(splitsEqual([{ recipient: A, share: 2000n }], [...current])).toBe(
      false,
    );
  });

  it('treats an unfinished row as a change', () => {
    expect(splitsEqual([{ recipient: undefined, share: undefined }], [])).toBe(
      false,
    );
    expect(splitsEqual([], [])).toBe(true);
  });
});

describe('getSplitsNotice', () => {
  const base = {
    canEdit: true,
    splitsCount: 0,
    proofLength: 3,
    hasAvailable: false,
    hasPendingToSplit: false,
  };

  it('is empty when nothing blocks the setup', () => {
    expect(getSplitsNotice(base)).toBeNull();
  });

  it('warns that editing waits for the first rewards', () => {
    expect(getSplitsNotice({ ...base, proofLength: 0 })).toBe(
      'canSetupBeforeFirstRewards',
    );
  });

  it('warns about unclaimed rewards before the first setup', () => {
    expect(getSplitsNotice({ ...base, hasAvailable: true })).toBe(
      'unclaimedBeforeSetup',
    );
  });

  it('blocks editing without a first distribution', () => {
    expect(
      getSplitsNotice({
        ...base,
        canEdit: false,
        splitsCount: 2,
        proofLength: 0,
      }),
    ).toBe('disabledNoProof');
  });

  it('blocks editing with unclaimed rewards', () => {
    expect(
      getSplitsNotice({
        ...base,
        canEdit: false,
        splitsCount: 2,
        hasAvailable: true,
      }),
    ).toBe('disabledUnclaimed');
  });

  it('blocks editing with pending shares', () => {
    expect(
      getSplitsNotice({ ...base, canEdit: false, hasPendingToSplit: true }),
    ).toBe('disabledPending');
  });

  it('shows no setup hint to a wallet that cannot edit', () => {
    expect(
      getSplitsNotice({ ...base, canEdit: false, proofLength: 0 }),
    ).toBeNull();
  });
});

describe('labels', () => {
  it('labels the submit by current splits', () => {
    expect(getSplitsSubmitLabel(false)).toBe('Save splits');
    expect(getSplitsSubmitLabel(true)).toBe('Apply changes');
  });

  it('labels the view action by current splits', () => {
    expect(getSplitsActionLabel(false)).toBe('Set up splits');
    expect(getSplitsActionLabel(true)).toBe('Edit splitters');
  });
});

describe('getSplitsStageTexts', () => {
  it('describes removing the splitter', () => {
    expect(getSplitsStageTexts(0)).toEqual({
      sign: {
        title: 'You are removing fee splitter',
        description: 'All rewards will go to the Rewards Address',
      },
      success: {
        title: 'Fee splitter has been removed',
        description: 'All rewards will go to the Rewards Address',
      },
    });
  });

  it('uses the singular for one recipient', () => {
    expect(getSplitsStageTexts(1).sign.description).toBe(
      'Setting 1 additional recipient',
    );
    expect(getSplitsStageTexts(1).success).toEqual({
      title: 'Fee splitter configuration has been updated',
      description: '1 additional recipient configured',
    });
  });

  it('uses the plural for several recipients', () => {
    expect(getSplitsStageTexts(3).sign).toEqual({
      title: 'You are updating fee splitter configuration',
      description: 'Setting 3 additional recipients',
    });
  });
});
