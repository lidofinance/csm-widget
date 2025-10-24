export type CurrentFrame = {
  startTimestamp: number;
  endTimestamp: number;
  numberEpochs: number;
};

export type RateStatus = 'good' | 'semi' | 'bad';

export type UnifiedPerformance = CurrentFrame & {
  operatorAttestationRate: number;
  overallAttestationRate: number;
};

export type Performance = UnifiedPerformance & {
  threshold: number;
  status: RateStatus;
};
