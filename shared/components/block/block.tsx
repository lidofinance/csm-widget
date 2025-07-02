import { FC, PropsWithChildren } from 'react';
import { BlockColor, BlockStyle } from './style';
import { BlockProps } from '@lidofinance/lido-ui';

type Props = BlockProps & {
  accent?: BlockColor;
};

export const Block: FC<PropsWithChildren<Props>> = ({ children, ...props }) => (
  <BlockStyle {...props}>{children}</BlockStyle>
);
