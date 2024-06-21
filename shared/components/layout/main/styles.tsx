import { Container, ContainerProps } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export const MainStyle = styled(Container)<ContainerProps>`
  position: relative;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0;

  ${({ size }) =>
    size === 'tight' &&
    css`
      max-width: 590px;
    `};
`;
