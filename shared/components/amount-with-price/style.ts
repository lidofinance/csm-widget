import styled from 'styled-components';
import { StackStyle } from '../stack/style';
import { css } from 'styled-components';
import { Theme } from '@lidofinance/lido-ui';

type InjectedProps = {
  theme: Theme;
};

export const Wrapper = styled(StackStyle).attrs({ $gap: 'sm', $center: true })<{
  $big?: boolean;
}>`
  text-align: right;
  flex: 0 0 120px; // @style
  ${({ $big }) =>
    $big &&
    css<InjectedProps>`
      font-weight: 700;
      color: var(--lido-color-text);
      margin-right: ${({ theme }) => theme.spaceMap.md}px;
    `}
`;

export const AmountStyle = styled.div`
  min-width: 12ch;

  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.xl}px;
`;

export const PriceStyle = styled.div`
  min-width: 76px;

  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: ${({ theme }) => theme.fontSizesMap.lg}px;
  opacity: 0.5;
`;
