import styled from 'styled-components';

export const LaticeStyle = styled.div`
  display: flex;
  flex-direction: column;
  overflow: hidden;

  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid var(--lido-color-border);

  > * {
    padding: 12px 16px;

    &:not(:last-child) {
      border-bottom: 1px solid var(--lido-color-border);
    }
  }

  label > svg + div {
    padding-left: 12px;

    p {
      font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
      line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
    }
  }
`;
