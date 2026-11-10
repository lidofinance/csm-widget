import { Box } from '@lidofinance/lido-ui';
import MinusIcon from 'assets/icons/minus.svg?react';
import PlusIcon from 'assets/icons/plus.svg?react';
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
