import { Theme } from '@lidofinance/lido-ui';
import styled, { css, CSSProperties } from 'styled-components';

const gapValues = {
  none: 0,
  xxs: 2,
  ms: 12,
};

export type StackStyleProps = {
  $direction?: 'row' | 'column';
  $gap?: keyof Theme['spaceMap'] | keyof typeof gapValues;
  $align?: CSSProperties['alignItems'];
  $justify?: CSSProperties['justifyContent'];
  $wrap?: boolean;
  $selfAlign?: CSSProperties['alignSelf'];
  $selfJustify?: CSSProperties['justifySelf'];
};

export const StackStyle = styled.div<StackStyleProps>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: ${({ $gap = 'md', theme }) =>
    $gap in gapValues
      ? gapValues[$gap as keyof typeof gapValues]
      : theme.spaceMap[$gap as keyof Theme['spaceMap']]}px;
  ${({ $align }) =>
    $align &&
    css`
      align-items: ${$align};
    `}
  ${({ $justify }) =>
    $justify &&
    css`
      justify-content: ${$justify};
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
  ${({ $selfAlign }) =>
    $selfAlign &&
    css`
      align-self: ${$selfAlign};
    `}
  ${({ $selfJustify }) =>
    $selfJustify &&
    css`
      justify-self: ${$selfJustify};
    `}
`;
