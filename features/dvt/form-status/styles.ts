import styled from 'styled-components';
import { Accordion } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';

export const AccordionStyle = styled(Accordion)`
  margin: 0;

  background: var(--lido-color-backgroundSecondary);

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

export const WrapperStyle = styled(Stack).attrs({
  direction: 'column',
  gap: 'sm',
})<{ $error?: boolean }>`
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  border: 1px solid
    ${({ $error }) =>
      $error ? 'var(--lido-color-error)' : 'var(--lido-color-border)'};
`;
