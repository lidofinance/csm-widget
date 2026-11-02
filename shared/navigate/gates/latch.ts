export type LatchState = { show: boolean; latchedFor: string | undefined };

/** Once the rule has passed for an address, keep showing until the address changes. */
export const resolveLatch = (
  latchedFor: string | undefined,
  canShow: boolean,
  address: string | undefined,
): LatchState => {
  if (!address) return { show: canShow, latchedFor: undefined };
  if (canShow) return { show: true, latchedFor: address };
  if (latchedFor === address) return { show: true, latchedFor };
  return { show: false, latchedFor: undefined };
};
