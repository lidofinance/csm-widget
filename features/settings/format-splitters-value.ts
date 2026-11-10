import { FeeSplit } from '@lidofinance/lido-csm-sdk';

export const formatSplittersValue = (
  splits: FeeSplit[] | undefined,
  isCsmFamily: boolean,
): string | undefined => {
  if (!splits?.length) return undefined;

  const count = `${splits.length} ${splits.length === 1 ? 'address' : 'addresses'}`;
  const equal = splits.every(({ share }) => share === splits[0].share);

  return isCsmFamily && equal
    ? `${count}, ${Number(splits[0].share) / 100}% each`
    : count;
};
