import { type FC } from 'react';
import { useWatch } from 'react-hook-form';
import { StepTrack as SharedStepTrack } from 'shared/components';
import type { CuratedOperatorFormInputType } from '../context/types';

export const StepTrack: FC = () => {
  const currentStep = useWatch<CuratedOperatorFormInputType, 'step'>({
    name: 'step',
  });

  return <SharedStepTrack current={currentStep} length={4} />;
};
