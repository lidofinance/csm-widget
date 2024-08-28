import { FC, PropsWithChildren } from 'react';
import { LaticeStyle, LaticeVariant } from './style';

type LaticeProps = {
  variant?: LaticeVariant;
};

export const Latice: FC<PropsWithChildren<LaticeProps>> = ({
  children,
  variant = 'default',
}) => <LaticeStyle $variant={variant}>{children}</LaticeStyle>;
