import { getUprDelta } from './get-upr-delta';

describe('getUprDelta', () => {
  it('good is above with positive diff', () => {
    const r = getUprDelta({
      operatorAttestationRate: 0.99,
      threshold: 0.94,
      status: 'good',
    });
    expect(r.direction).toBe('above');
    expect(r.diff).toBeCloseTo(0.05);
  });

  it('semi is above', () => {
    const r = getUprDelta({
      operatorAttestationRate: 0.96,
      threshold: 0.94,
      status: 'semi',
    });
    expect(r.direction).toBe('above');
    expect(r.diff).toBeCloseTo(0.02);
  });

  it('bad is below with absolute diff', () => {
    const r = getUprDelta({
      operatorAttestationRate: 0.9,
      threshold: 0.94,
      status: 'bad',
    });
    expect(r.direction).toBe('below');
    expect(r.diff).toBeCloseTo(0.04);
  });
});
