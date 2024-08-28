import { Container, ContainerProps } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';

export const MainStyle = styled(Container)<ContainerProps>`
  position: relative;
  margin-top: ${({ theme }) => theme.spaceMap.sm}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.xxl}px;
  padding: 0;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: 0 20px;
  }

  ${({ size }) =>
    size === 'tight' &&
    css`
      max-width: 590px;
    `};
`;
