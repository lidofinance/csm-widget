import { OPERATOR_TYPE } from 'consts';
import { HeaderButton } from 'shared/layout/header/styles';
import styled from 'styled-components';
import { CURVE_VARIANTS } from '../curve-badge/styles';

export const ButtonStyle = styled(HeaderButton)<{
  $variant?: OPERATOR_TYPE;
}>`
  --padding: 12px;
  --grouped-padding-offset: 4px;

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;
