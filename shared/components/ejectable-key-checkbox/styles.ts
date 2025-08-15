import { Checkbox } from '@lidofinance/lido-ui';
import { StatusStyle } from 'shared/components/status-chip/style';
import styled from 'styled-components';

// FIXME: Checkbox render <p> as wrapper of content (usually <div>)
export const CheckboxStyled = styled(Checkbox)`
  svg + div {
    width: 100%;
  }

  ${StatusStyle} {
    margin-block: -4px;
  }

  :has(input:disabled) {
    background: var(--lido-color-background);
  }
`;
