import { FC, PropsWithChildren } from 'react';
import { Number, StepContent, StepTitle, StepWrapper } from './styles';

export const Step: FC<
  PropsWithChildren<{ stepNum: string; title: string }>
> = ({ stepNum: number, title, children }) => {
  return (
    <StepWrapper>
      <Number>{number}</Number>
      <StepTitle>{title}</StepTitle>
      <StepContent>{children}</StepContent>
    </StepWrapper>
  );
};
