import { FC } from 'react';
import { Counter } from 'shared/components';
import { useSurveyEnabled } from 'shared/hooks';

export const CounterSurveys: FC = () => {
  const { enabled, variant } = useSurveyEnabled(true);
  const count = Number(enabled && variant === 'submit');

  return <Counter count={count} />;
};
