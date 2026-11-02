import { FC } from 'react';
import {
  PageDisclaimerKey,
  usePageDisclaimer,
} from './page-disclaimer-provider';

export const DisclaimerMark: FC<{ id: PageDisclaimerKey }> = ({ id }) => {
  usePageDisclaimer(id);
  return <>*</>;
};
