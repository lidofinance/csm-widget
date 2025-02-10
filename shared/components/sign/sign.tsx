import { Box } from '@lidofinance/lido-ui';
import { ReactComponent as MinusIcon } from 'assets/icons/minus.svg';
import { ReactComponent as PlusIcon } from 'assets/icons/plus.svg';
import { FC } from 'react';
import { SignStyle } from './style';

export type SignType = 'plus' | 'minus';

export const Sign: FC<{ type: SignType }> = ({ type }) => (
  <Box position="relative" display="inline">
    <Box position="absolute" display="flex" left="-46px" top="0px" bottom="0px">
      <SignStyle>{type === 'minus' ? <MinusIcon /> : <PlusIcon />}</SignStyle>
    </Box>
  </Box>
);
