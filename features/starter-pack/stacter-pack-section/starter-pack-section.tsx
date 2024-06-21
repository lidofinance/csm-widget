import { FC, PropsWithChildren } from 'react';

import {
  BlockStyled,
  Heading,
  Number,
  StepContent,
  StepWrapper,
  Steps,
} from './styles';

export const StarterPackSection: FC<PropsWithChildren> = ({ children }) => {
  return (
    <BlockStyled>
      <Heading>
        <h2>CSM node operator starter pack</h2>
        <p>
          Make sure you’ve completed all the basic steps before joining the
          Community Staking Module
        </p>
      </Heading>
      <Steps>
        <Step number="1" title="Have tokens for Bond">
          Minimum 2 stETH is required Learn more about the bond curve
        </Step>
        <Step number="2" title="Prepare hardware">
          Run your own hardware or use a cloud provider
        </Step>
        <Step number="3" title="Set up validation tools">
          Do it manually or use Plug&Play solutions
        </Step>
        <Step number="4" title="Generate keys">
          Prepare deposit data .json file for submitting keys
          <br />
          Follow the generation guide
        </Step>
      </Steps>
      {children}
    </BlockStyled>
  );
};

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
