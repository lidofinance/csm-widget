import styled from 'styled-components';
import { StackStyle } from '../stack/style';

export const WrapperStyle = styled(StackStyle).attrs({ $direction: 'column' })`
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spaceMap.md}px 0;

  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: 400;
`;
