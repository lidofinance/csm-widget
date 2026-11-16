type Args = {
  available: bigint;
  /** signed: negative when the bond is insufficient */
  delta: bigint;
  requiredForKey: bigint;
};

export const getNewValidatorProgress = ({
  available,
  delta,
  requiredForKey,
}: Args): number => {
  if (requiredForKey <= 0n) return 0;
  const covered = available + delta;
  if (covered <= 0n) return 0;
  if (covered >= requiredForKey) return 100;
  return Number((covered * 100n) / requiredForKey);
};
