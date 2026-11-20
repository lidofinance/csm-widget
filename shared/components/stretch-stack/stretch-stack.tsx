import { Stack, StackProps } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { FC } from 'react';
import s from './stretch-stack.module.css';

export const StretchStack: FC<StackProps> = ({ className, ...props }) => (
  <Stack {...props} className={cn(s.root, className)} />
);
