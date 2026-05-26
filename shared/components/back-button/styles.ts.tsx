import styled from 'styled-components';
import { StackStyle } from '../stack';

export const WrapStyle = styled(StackStyle).attrs({
  $align: 'center',
  $gap: 'xxs',
})`
  padding: 4px;
  margin: -4px;
`;
