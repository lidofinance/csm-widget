import { Theme } from '@lidofinance/lido-ui';
import styled, { css, CSSProperties } from 'styled-components';

export type StackStyleProps = {
  $direction?: 'row' | 'column';
  $gap?: keyof Theme['spaceMap'] | 'none';
  $align?: CSSProperties['alignItems'];
  $spaceBetween?: boolean;
  $wrap?: boolean;
};

export const StackStyle = styled.div<StackStyleProps>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: ${({ $gap = 'md', theme }) =>
    $gap === 'none' ? 0 : theme.spaceMap[$gap]}px;
  ${({ $align }) =>
    $align &&
    css`
      align-items: ${$align};
    `}
  ${({ $spaceBetween }) =>
    $spaceBetween &&
    css`
      justify-content: space-between;
    `}
  ${({ $wrap }) =>
    $wrap &&
    css`
      flex-wrap: wrap;
      & > * {
        flex: 1;
        min-width: fit-content;
      }
    `}
`;
