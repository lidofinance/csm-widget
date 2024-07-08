import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

type Props = {
  $direction?: 'row' | 'column';
  $gap?: keyof Theme['spaceMap'];
  $center?: boolean;
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
`;

export const StackWrapStyle = styled(StackStyle)`
  flex-wrap: wrap;

  > * {
    flex: 1 1 47%;
    min-width: 230px;
  }
`;
