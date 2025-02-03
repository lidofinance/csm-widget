import { FC } from 'react';
import styled from 'styled-components';

export const StepsList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: start;
  justify-content: start;
  font-size: 14px;
  text-align: left;

  > li::marker {
    color: var(--lido-color-primary);
    font-weight: bold;
  }
`;

const StepsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 10px;
  width: 100%;
`;

export const NotificationsSteps: FC = () => {
  return (
    <>
      <StepsWrapper>
        <StepsList>
          <li>Get Telegram user Id</li>
          <li>Create and get a Telegram Bot token</li>
          <li>Start the chat with your bot</li>
        </StepsList>
      </StepsWrapper>
    </>
  );
};
