import { Stack, StackProps } from '@lidofinance/lido-app-ui';
import cn from 'classnames';
import { FC } from 'react';
import s from './survey-cards.module.css';

export const SurveyCards: FC<StackProps> = ({ className, ...props }) => (
  <Stack {...props} gap={8} className={cn(s.root, className)} />
);
