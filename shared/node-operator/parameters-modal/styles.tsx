import { Modal } from '@lidofinance/lido-ui';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { ComponentProps } from 'react';
import styled from 'styled-components';
import { CURVE_VARIANTS } from '../curve-badge/styles';

export const StyledModal = styled((props: ComponentProps<typeof Modal>) => (
  <Modal {...props} />
))<{
  $variant?: OPERATOR_TYPE;
}>`
  > div {
    width: 544px;
    --border-width: 8px;

    > div {
      border: var(--border-width) solid transparent;
      background-clip: padding-box;
      z-index: initial;

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
      }

      > div {
        padding-inline: calc(32px - 8px);

        &:nth-child(1) {
          padding-top: 24px;
        }

        &:nth-child(2) {
          padding-bottom: 24px;
        }
      }
    }
  }
`;
