import { Stack } from '@lidofinance/lido-app-ui';
import { FC } from 'react';
import { useWatch } from 'react-hook-form';
import { WizardStepper } from 'shared/form-page';
import type { CuratedOperatorFormInputType } from '../context/types';
import { CURATED_OPERATOR_STEP_LABELS } from '../curated-operator-wizard';
import { CuratedOperatorStepHeading } from './step-heading';

export const CuratedOperatorHeader: FC<{ done?: boolean }> = ({ done }) => {
  // Rendered outside FormReady: `step` is undefined until async defaultValues resolve
  const step =
    useWatch<CuratedOperatorFormInputType, 'step'>({ name: 'step' }) ?? 0;

  return (
    <Stack gap={24} data-testid="curatedOperatorHeader">
      <WizardStepper
        steps={CURATED_OPERATOR_STEP_LABELS}
        current={step}
        done={done}
      />
      {!done && <CuratedOperatorStepHeading step={step} />}
    </Stack>
  );
};
