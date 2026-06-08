import { Modal } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { StackStyle } from 'shared/components';
import styled from 'styled-components';
import { CURVE_VARIANTS } from 'shared/node-operator/curve-badge/styles';

export const StyledModal = styled(Modal)`
  & > div {
    width: 640px;
  }
`;

export const StackWrap = styled(StackStyle).attrs({ $wrap: true })`
  & > * {
    min-width: 220px;
  }
`;

export const OptionCard = styled(StackStyle).attrs({
  $direction: 'column',
  $justify: 'space-between',
})<{
  $variant?: OPERATOR_TYPE;
}>`
  --border-width: 2px;
  padding: 16px;
  border-radius: 10px;
  border: var(--border-width) solid transparent;
  background-color: rgba(var(--lido-rgb-background), 1);
  background-clip: padding-box;
  position: relative;
  z-index: initial;
  transition: all 0.2s ease;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: calc(-1 * var(--border-width));
    border-radius: inherit;
    ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
    transition: all 0.2s ease;
  }

  &:hover {
    background-color: rgba(var(--lido-rgb-background), 0.7);
  }
`;
