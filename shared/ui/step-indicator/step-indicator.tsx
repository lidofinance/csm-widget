import type { FC, HTMLAttributes, ReactNode } from 'react';
import {
  CheckIconStyle,
  CircleStyle,
  ConnectorStyle,
  LabelStyle,
  ListStyle,
  StepStatus,
  StepStyle,
} from './styles';

export type StepIndicatorStep = {
  label: ReactNode;
};

export type StepIndicatorProps = Omit<
  HTMLAttributes<HTMLOListElement>,
  'children'
> & {
  steps: StepIndicatorStep[];
  current: number;
};

const getStepStatus = (index: number, current: number): StepStatus => {
  if (index < current) return 'done';
  if (index === current) return 'current';
  return 'upcoming';
};

export const StepIndicator: FC<StepIndicatorProps> = ({
  steps,
  current,
  ...rest
}) => (
  <ListStyle {...rest}>
    {steps.map((step, index) => {
      const status = getStepStatus(index, current);

      return (
        <StepStyle
          key={index}
          aria-current={status === 'current' ? 'step' : undefined}
        >
          <CircleStyle $status={status}>
            {status === 'done' ? (
              <CheckIconStyle aria-hidden="true" />
            ) : (
              index + 1
            )}
          </CircleStyle>
          <LabelStyle $status={status}>{step.label}</LabelStyle>
          {index < steps.length - 1 && <ConnectorStyle aria-hidden="true" />}
        </StepStyle>
      );
    })}
  </ListStyle>
);
