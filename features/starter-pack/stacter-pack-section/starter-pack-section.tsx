import { FC, PropsWithChildren } from 'react';

import {
  BlockStyled,
  Heading,
  Number,
  StepContent,
  StepWrapper,
  Steps,
} from './styles';
import { Link } from '@lidofinance/lido-ui';

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
          2 Holesky stETH is required for the first validator
          <br />
          <Link href="https://hackmd.io/@lido/rJMcGj0Ap#Bond">Learn more</Link>
        </Step>
        <Step number="2" title="Prepare hardware">
          Run{' '}
          <Link href="https://ethereum.org/en/developers/docs/nodes-and-clients/run-a-node/#hardware">
            your own hardware
          </Link>{' '}
          or use a cloud provider
        </Step>
        <Step number="3" title="Set up validation tools">
          Do it manually or use Plug&Play solutions
        </Step>
        <Step number="4" title="Generate keys">
          Prepare deposit data (.json file) for submitting keys
          <br />
          Follow <Link>the generation guide</Link>
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
