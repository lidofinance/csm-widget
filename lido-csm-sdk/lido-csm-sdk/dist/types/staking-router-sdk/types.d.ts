export declare const ShareLimitStatus: {
  readonly FAR: 'FAR';
  readonly APPROACHING: 'APPROACHING';
  readonly EXHAUSTED: 'EXHAUSTED';
  readonly REACHED: 'REACHED';
};
export type ShareLimitStatus = keyof typeof ShareLimitStatus;
export type ShareLimitInfo = {
  active: bigint;
  activeLeft: bigint;
  capacity: bigint;
  queue: bigint;
};
//# sourceMappingURL=types.d.ts.map
