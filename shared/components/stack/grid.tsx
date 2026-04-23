import styled from 'styled-components';
import { type StackStyleProps, getGap } from './style';

type GridProps = Pick<StackStyleProps, '$gap'>;

export const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${({ $gap = 'md', theme }) => getGap($gap, theme)}px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
`;
