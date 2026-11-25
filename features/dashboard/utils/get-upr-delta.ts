import { Performance } from 'types';

export const getUprDelta = ({
  operatorAttestationRate,
  threshold,
  status,
}: Pick<Performance, 'operatorAttestationRate' | 'threshold' | 'status'>): {
  direction: 'above' | 'below';
  diff: number;
} => ({
  direction: status === 'bad' ? 'below' : 'above',
  diff: Math.abs(operatorAttestationRate - threshold),
});
