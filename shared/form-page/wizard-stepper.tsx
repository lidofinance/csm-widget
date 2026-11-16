import { Steps } from '@lidofinance/lido-app-ui';
import { FC, useMemo } from 'react';
import { VisuallyHiddenStyle } from './styles';
import { getStepTrackText } from './wizard';

export type WizardStepperProps = {
  steps: string[];
  current: number;
  done?: boolean;
};

export const WizardStepper: FC<WizardStepperProps> = ({
  steps,
  current,
  done,
}) => {
  const active = done ? steps.length : current;
  const items = useMemo(() => steps.map((label) => ({ label })), [steps]);

  return (
    <div>
      <Steps steps={items} current={active} />
      <VisuallyHiddenStyle data-testid="stepTrackText">
        {getStepTrackText(active, steps.length)}
      </VisuallyHiddenStyle>
    </div>
  );
};
