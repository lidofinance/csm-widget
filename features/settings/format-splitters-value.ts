import { FeeSplit } from '@lidofinance/lido-csm-sdk';

export const formatSplittersValue = (
  splits: FeeSplit[] | undefined,
  isCsmFamily: boolean,
): string | undefined => {
  if (!splits?.length) return undefined;

  const count = `${splits.length} ${splits.length === 1 ? 'address' : 'addresses'}`;
  const equal = splits.every(({ share }) => share === splits[0].share);
  if (!isCsmFamily || !equal) return count;

  const share = `${Number(splits[0].share) / 100}%`;
  return splits.length === 1 ? `${count}, ${share}` : `${count}, ${share} each`;
};
