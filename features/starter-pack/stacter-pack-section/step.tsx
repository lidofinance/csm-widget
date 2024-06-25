import { FC, PropsWithChildren } from 'react';
import { Number, StepContent, StepWrapper } from './styles';

export const Step: FC<PropsWithChildren<{ number: string; title: string }>> = ({
  number,
  title,
  children,
}) => {
  return (
    <StepWrapper>
      <Number>{number}</Number>
      <StepContent>
        <h3>{title}</h3>
        <p>{children}</p>
      </StepContent>
    </StepWrapper>
  );
};
