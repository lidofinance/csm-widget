import { Stack } from 'shared/components';
import styled from 'styled-components';

export const Description = styled(Stack).attrs({
  direction: 'column',
  gap: 'sm',
})`
  & code {
    padding: 1px 4px;
    background: var(--lido-color-backgroundSecondary);
    border-radius: 3px;
    font-size: 0.9em;
  }
`;
