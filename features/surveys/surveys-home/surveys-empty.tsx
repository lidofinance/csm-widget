import { EmptyState } from '@lidofinance/lido-app-ui';
import { FC } from 'react';

export const SurveysEmpty: FC = () => (
  <EmptyState
    title="No surveys available"
    description="You are not a node operator and have not been added as a delegate for any operators"
  />
);
