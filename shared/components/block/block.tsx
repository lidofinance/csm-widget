import { FC, PropsWithChildren } from 'react';
import { BlockColor, BlockStyle, HatBlockStyle } from './style';
import { BlockProps } from '@lidofinance/lido-ui';

type Props = BlockProps & {
  accent?: BlockColor;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  overflowHidden?: boolean;
};

export const Block: FC<PropsWithChildren<Props>> = ({ children, ...props }) => (
  <BlockStyle {...props}>{children}</BlockStyle>
);

export const HatBlock: FC<PropsWithChildren<Props>> = ({
  children,
  ...props
}) => <HatBlockStyle {...props}>{children}</HatBlockStyle>;
