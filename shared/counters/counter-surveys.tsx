import { FC } from 'react';
import { Counter } from 'shared/components';
import { useSurveyEnabled } from 'shared/hooks';

export const CounterSurveys: FC = () => {
  const { enabled } = useSurveyEnabled(true);
  const count = Number(enabled);

  return <Counter count={count} />;
};
