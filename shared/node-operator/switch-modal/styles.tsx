import { StackStyle } from 'shared/components/stack/style';
import styled from 'styled-components';

export const StyledStack = styled(StackStyle)`
  margin-top: ${({ theme }) => theme.spaceMap.lg}px;
  flex-wrap: wrap;
`;

export const StyledStackItem = styled(StackStyle).attrs({ $gap: 'sm' })`
  align-items: center;
  flex-grow: 1;
`;
