import { type OperatorType } from '@lidofinance/lido-csm-sdk';
import { HeaderButton } from 'shared/layout/header/styles';
import styled from 'styled-components';
import { CURVE_VARIANTS } from '../curve-badge/styles';

export const ButtonStyle = styled(HeaderButton)<{
  $variant?: OperatorType;
}>`
  --padding: 12px;
  --grouped-padding-offset: 4px;

  ${({ $variant }) => ($variant ? (CURVE_VARIANTS[$variant] ?? '') : '')}

  ${({ theme }) => theme.mediaQueries.md} {
    > span:first-of-type {
      display: none;
    }
  }
`;
