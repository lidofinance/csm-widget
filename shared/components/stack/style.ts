import { Theme } from '@lidofinance/lido-ui';
import styled from 'styled-components';

type Props = {
  $direction?: 'row' | 'column';
  $gap?: keyof Theme['spaceMap'];
};

export const StackStyle = styled.div<Props>`
  display: flex;
  flex-direction: ${({ $direction = 'row' }) => $direction};
  gap: ${({ $gap = 'md', theme }) => theme.spaceMap[$gap]}px;
`;
