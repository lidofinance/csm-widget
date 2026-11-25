import { derivePerformance } from './derive-performance';

const frame = { startTimestamp: 1, endTimestamp: 2, numberEpochs: 3 };
const make = (operatorAttestationRate: number) => ({
  ...frame,
  operatorAttestationRate,
  overallAttestationRate: 0.99,
});

describe('derivePerformance', () => {
  it('sets threshold = overall - leeway', () => {
    expect(derivePerformance(make(0.99), 500).threshold).toBeCloseTo(0.94);
  });

  it('is bad at the threshold', () => {
    const { threshold } = derivePerformance(make(0.99), 500);
    expect(derivePerformance(make(threshold), 500).status).toBe('bad');
  });

  it('is semi just above the threshold', () => {
    expect(derivePerformance(make(0.95), 500).status).toBe('semi');
  });

  it('is semi at overall - offset / 2', () => {
    expect(derivePerformance(make(0.99 - 0.025), 500).status).toBe('semi');
  });

  it('is good above overall - offset / 2', () => {
    expect(derivePerformance(make(0.97), 500).status).toBe('good');
  });

  it('passes frame fields through', () => {
    expect(derivePerformance(make(0.97), 500)).toMatchObject(frame);
  });
});
