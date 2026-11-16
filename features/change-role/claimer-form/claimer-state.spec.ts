import { zeroAddress } from 'viem';
import {
  CLAIMER_TOOLTIP,
  getClaimerAddress,
  getClaimerStageTitles,
} from './claimer-state';

const CLAIMER = '0x1111111111111111111111111111111111111111';

describe('getClaimerAddress', () => {
  it('sends the zero address on unset, ignoring the typed one', () => {
    expect(getClaimerAddress({ intent: 'unset', address: CLAIMER })).toBe(
      zeroAddress,
    );
  });

  it('sends the typed address on set', () => {
    expect(getClaimerAddress({ address: CLAIMER })).toBe(CLAIMER);
  });

  it('falls back to the zero address without input', () => {
    expect(getClaimerAddress({})).toBe(zeroAddress);
  });
});

describe('getClaimerStageTitles', () => {
  it('pins the unset stage titles', () => {
    expect(getClaimerStageTitles('unset')).toEqual({
      sign: 'You are unsetting Rewards claimer',
      success: 'Rewards claimer has been unset',
    });
  });

  it('pins the set stage titles', () => {
    expect(getClaimerStageTitles()).toEqual({
      sign: 'You are setting Rewards Claimer Address',
      success: 'Rewards Claimer Address has been set',
    });
  });
});

describe('CLAIMER_TOOLTIP', () => {
  it('pins the e2e tooltip copy', () => {
    expect(CLAIMER_TOOLTIP).toBe(
      'Is an optional address authorized to trigger reward claims on your behalf. Unlike the Rewards Address, it does not receive the funds. It only initiates the claim transaction.',
    );
  });
});
