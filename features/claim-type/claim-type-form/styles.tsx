import styled from 'styled-components';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';
import { StackStyle } from 'shared/components';
import { Button, Text } from '@lidofinance/lido-ui';

export const StyledContainer = styled(StackStyle).attrs({
  $direction: 'column',
})`
  gap: 40px;
  max-width: 420px;
  text-align: center;
  align-self: center;
  align-items: center;
`;

export const StyledButton = styled(Button)`
  max-width: 360px;
`;

export const BadgeWrapper = styled.div`
  position: relative;
  display: grid;
  width: 150px;
  height: 120px;

  &:before {
    content: '';
    grid-area: 1 / 1;
    filter: blur(38px);
    opacity: 0.8;
    ${CURVE_VARIANTS[OPERATOR_TYPE.ICS]}
  }
`;

export const BadgeMain = styled.div`
  grid-area: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  border-radius: 28px;
  border: 4px solid rgba(var(--lido-rgb-foreground), 0.8);
  ${CURVE_VARIANTS[OPERATOR_TYPE.ICS]}
  background-origin: border-box;
`;

export const BadgeText = styled(Text)`
  font-weight: 700;
  font-size: 36px;
  letter-spacing: -0.5pt;
  color: var(--lido-color-foreground);
`;
