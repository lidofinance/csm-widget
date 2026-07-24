import { FC } from 'react';
import { Step, StepsWrapper } from './styles';

type StepIndicatorProps = {
  length: number;
  current: number;
  backSolid?: boolean;
};

export const StepIndicator: FC<StepIndicatorProps> = ({
  length,
  current,
  backSolid,
}) => (
  <StepsWrapper $backSolid={backSolid}>
    {Array.from({ length }, (v, i) => (
      <Step key={i} $type={i < current ? -1 : i > current ? 1 : 0} />
    ))}
  </StepsWrapper>
);
