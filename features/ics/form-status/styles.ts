import styled, { css } from 'styled-components';
import { Accordion, Block, Check, Close } from '@lidofinance/lido-ui';

export const FormStatusStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.md}px;
  border: 1px solid var(--lido-color-border);
  background: var(--lido-color-background);
`;

export const StatusHeaderStyled = styled.div`
  padding: ${({ theme }) => theme.spaceMap.md}px 0;
  border-bottom: 1px solid var(--lido-color-border);
`;

export const ScoreRowStyled = styled.div`
  padding: ${({ theme }) => theme.spaceMap.sm}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.sm}px;
  border: 1px solid var(--lido-color-border);
  background: var(--lido-color-foreground);

  & > div {
    flex: 1;
  }

  & > div:first-child > div:nth-child(2) {
    flex: 1;
  }
`;

export const ScoreValueStyled = styled.div<{ $passed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  font-weight: 700;

  ${({ $passed }) =>
    $passed
      ? css`
          color: var(--lido-color-success);
        `
      : css`
          color: var(--lido-color-error);
        `}
`;

export const RequiredScoreStyled = styled.div<{ $passed: boolean }>`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  color: ${({ $passed }) =>
    $passed ? 'var(--lido-color-success)' : 'var(--lido-color-error)'};
`;

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  background: var(--lido-color-backgroundSecondary);
  /* padding: 20px; */

  & > div:first-child {
    padding: 20px;
  }

  & > div + div > div {
    padding: 0 20px 20px 20px;
  }

  p,
  ul,
  ol {
    margin: 0;
  }
`;

export const BlockStyled = styled(Block)`
  background: var(--lido-color-backgroundSecondary);
`;

export const FailIcon = styled(Close)`
  color: var(--lido-color-error);
  vertical-align: middle;
`;

export const SuccessIcon = styled(Check)`
  color: var(--lido-color-success);
  vertical-align: middle;
`;
