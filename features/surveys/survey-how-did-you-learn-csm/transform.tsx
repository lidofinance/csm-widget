import { HowDidYouLearnCsm } from '../types';

export const transformOutcoming = (
  data: HowDidYouLearnCsm,
): HowDidYouLearnCsm => ({
  ...data,
  sourceTwo: data.sourceTwo || '',
  other: data.other || '',
});
