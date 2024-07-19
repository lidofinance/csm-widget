import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

type Props = {
  $direction?: 'row' | 'column';
  $gap?: keyof Theme['spaceMap'];
  $center?: boolean;
  $spaceBetween?: boolean;
  $wrap?: boolean;
};

export const StackStyle = styled.div<Props>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: ${({ $gap = 'md', theme }) => theme.spaceMap[$gap]}px;
  ${({ $center }) =>
    $center &&
    css`
      align-items: center;
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
