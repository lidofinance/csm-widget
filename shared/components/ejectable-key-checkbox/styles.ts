import { Checkbox } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { StackStyle } from '../stack';

// FIXME: Checkbox render <p> as wrapper of content (usually <div>)
export const CheckboxStyled = styled(Checkbox)`
  svg {
    flex: 0 0 auto;
  }

  svg + div {
    width: 100%;
  }

  :has(input:disabled) {
    background: var(--lido-color-background);
  }
`;

export const StatusesWrapper = styled(StackStyle).attrs({
  $direction: 'column',
  $gap: 'xs',
})`
  margin-block: -4px;
`;
