import { FC } from 'react';
import { NavCounter } from './nav-counter';
import { useSurveyEnabled } from 'shared/hooks';

export const CounterSurveys: FC = () => {
  const { enabled, variant } = useSurveyEnabled(true);
  const count = Number(enabled && variant === 'submit');

  return <NavCounter count={count} />;
};
