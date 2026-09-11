import styled, { css } from 'styled-components';
import { type StackStyleProps, getGap } from './style';

type GridProps = Pick<StackStyleProps, '$gap'> & { $stackOnMobile?: boolean };

export const Grid = styled.div<GridProps>`
  display: grid;
  gap: ${({ $gap = 'md', theme }) => getGap($gap, theme)}px;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));

  ${({ $stackOnMobile }) =>
    $stackOnMobile &&
    css`
      ${({ theme }) => theme.mediaQueries.md} {
        grid-template-columns: 1fr;
      }
    `}
`;
