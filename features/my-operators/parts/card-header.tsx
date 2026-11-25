import { Stack, StackProps } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { FC } from 'react';
import s from './card-header.module.css';

export const CardHeader: FC<StackProps> = ({ className, ...props }) => (
  <Stack {...props} className={cn(s.header, className)} />
);

export const CardHeaderLine: FC<StackProps> = ({ className, ...props }) => (
  <Stack
    {...props}
    direction="row"
    align="center"
    className={cn(s.line, className)}
  />
);
