import styled from 'styled-components';

export const WhatsNextStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  ol {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin: 0;
    padding-left: 24px;
    color: var(--lido-app-ui-color-text-default);
    line-height: 28px;
  }
`;
