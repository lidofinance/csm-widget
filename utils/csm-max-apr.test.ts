import { calcMaxApr } from './csm-max-apr';

const ST_APR = 0.02316285714285714;
const eth = (x: number) => BigInt(Math.round(x * 1e6)) * 10n ** 12n;

describe('calcMaxApr', () => {
  it('Default curve', () => {
    expect(
      calcMaxApr({
        stApr: ST_APR,
        bondConfig: [
          { minKeyNumber: 1, value: eth(2.4) },
          { minKeyNumber: 2, value: eth(1.3) },
        ],
        rewardsConfig: [{ minKeyNumber: 1, value: 350n }],
        stakePerKey: 32,
      }),
    ).toBe(4.53);
  });

  it('ICS curve', () => {
    expect(
      calcMaxApr({
        stApr: ST_APR,
        bondConfig: [
          { minKeyNumber: 1, value: eth(1.5) },
          { minKeyNumber: 2, value: eth(1.3) },
        ],
        rewardsConfig: [
          { minKeyNumber: 1, value: 600n },
          { minKeyNumber: 17, value: 350n },
        ],
        stakePerKey: 32,
      }),
    ).toBe(6.08);
  });

  it('IDVTC curve', () => {
    expect(
      calcMaxApr({
        stApr: ST_APR,
        bondConfig: [
          { minKeyNumber: 1, value: eth(1.5) },
          { minKeyNumber: 2, value: eth(0.5) },
        ],
        rewardsConfig: [
          { minKeyNumber: 1, value: 350n },
          { minKeyNumber: 65, value: 200n },
        ],
        stakePerKey: 32,
      }),
    ).toBe(7.9);
  });

  it('0x02 curve', () => {
    expect(
      calcMaxApr({
        stApr: ST_APR,
        bondConfig: [
          { minKeyNumber: 1, value: eth(32) },
          { minKeyNumber: 2, value: eth(30) },
        ],
        rewardsConfig: [{ minKeyNumber: 1, value: 200n }],
        stakePerKey: 2048,
      }),
    ).toBe(5.83);
  });
});
