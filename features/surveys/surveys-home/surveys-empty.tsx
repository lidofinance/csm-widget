import { FC } from 'react';
import { SurveySection } from '../components';
import { Text } from '@lidofinance/lido-ui';

export const SurveysEmpty: FC = () => (
  <SurveySection title="No surveys available">
    <Text size="sm" color="secondary">
      You are not a node operator and have not been added as a delegate for any
      operators.
    </Text>
  </SurveySection>
);
