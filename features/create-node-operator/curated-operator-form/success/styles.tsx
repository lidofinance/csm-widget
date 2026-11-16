import styled from 'styled-components';

export const NextStepsStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const NextStepRowStyle = styled.div`
  display: grid;
  grid-template-columns: 48px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 0;

  & + & {
    border-top: 1px solid var(--lido-app-ui-color-border-subtle);
  }

  @media (max-width: 439px) {
    grid-template-columns: 48px minmax(0, 1fr);

    & > button {
      grid-column: 2;
      justify-self: start;
    }
  }
`;

export const NextStepIconStyle = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--lido-app-ui-border-radius-pill);
  background: var(--lido-app-ui-color-tint-info);
  color: var(--lido-app-ui-color-icons-info);
`;

export const NextStepTextStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
`;
