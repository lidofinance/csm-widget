import { Block } from '@lidofinance/lido-ui';
import { Stack } from 'shared/components';
import styled from 'styled-components';

export const Heading = styled(Stack).attrs(() => ({ direction: 'column' }))``;

export const Header = styled.h3`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
  font-weight: bold;
`;

export const BlockStyled = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;

  text-align: center;
  color: var(--lido-color-primaryContrast);
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;

  background: radial-gradient(
      114.67% 199.49% at 51.78% 123.98%,
      #ef81f9 0%,
      rgba(249, 129, 183, 0) 100%
    ),
    linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%);

  a {
    flex: 1 0 48%;
  }
`;
