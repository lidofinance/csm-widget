import { DisplayOperatorType } from 'consts';
import { HeaderButton } from 'shared/layout/header/styles';
import styled from 'styled-components';
import { CURVE_VARIANTS } from '../curve-badge/styles';

export const BadgeButtonStyle = styled.button`
  display: block;
  width: max-content;
  padding: 0;
  font: inherit;
  color: inherit;
  border: none;
  background: none;
  cursor: pointer;

  &:not(:disabled):hover {
    opacity: 0.85;
  }

  &:disabled {
    cursor: default;
  }
`;

export const ButtonStyle = styled(HeaderButton)<{
  $variant?: DisplayOperatorType;
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
