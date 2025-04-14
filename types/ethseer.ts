export type CurrentFrame = {
  startTimestamp: number;
  endTimestamp: number;
  numberEpochs: number;
};

export type RateReponse = CurrentFrame & {
  operatorAttestationRate: number;
  overallAttestationRate: number;
};
