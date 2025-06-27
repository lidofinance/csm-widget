import { ButtonIcon, Close } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const CloseButton = styled(ButtonIcon).attrs({
  icon: <Close />,
  color: 'secondary',
  variant: 'ghost',
  size: 'xxs',
})`
  color: var(--lido-color-textSecondary);
  flex-shrink: 0;
  font-size: 6px;
`;
