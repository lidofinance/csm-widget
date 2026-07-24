import { HowDidYouLearnCsm } from '../types';

export const transformOutgoing = (
  data: HowDidYouLearnCsm,
): HowDidYouLearnCsm => ({
  ...data,
  sourceTwo: data.sourceTwo || '',
  other: data.other || '',
});
