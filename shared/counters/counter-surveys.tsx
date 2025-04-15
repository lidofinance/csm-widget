import { FC } from 'react';
import { Counter } from 'shared/components';
import { useSurveysCall } from 'shared/hooks';

export const CounterSurveys: FC = () => {
  const required = useSurveysCall();
  const count = Number(required);

  return <Counter count={count} />;
};
