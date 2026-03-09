import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { BadgeStyle } from '../role-badge/styles';

type InjectedProps = {
  theme: Theme;
};

export const CURVE_VARIANTS: Record<OPERATOR_TYPE, ReturnType<typeof css>> = {
  [OPERATOR_TYPE.CSM_DEF]: css`
    background: linear-gradient(78deg, #304352 -49.42%, #d7d2cc 157.87%),
      linear-gradient(79deg, #00a3ff -9.53%, #2238ff 202.88%);
  `,
  [OPERATOR_TYPE.CSM_LEA]: css<InjectedProps>`
    background: radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%),
      rgba(215, 220, 227, 0.56);
  `,
  [OPERATOR_TYPE.CSM_ICS]: css`
    background: linear-gradient(69deg, #08d1ff 7.1%, #88f493 127.77%),
      radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%);
  `,
  [OPERATOR_TYPE.CC]: css<InjectedProps>`
    background: linear-gradient(93deg, #08d1ff -23.5%, #88f493 121.99%);
  `,
  [OPERATOR_TYPE.CM_PO]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_PTO]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_DO]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_EEO]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_IODC]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_MODC]: css`
    background: var(--lido-color-text);
  `,
  [OPERATOR_TYPE.CM_PGO]: css`
    background: var(--lido-color-text);
  `,
};

export const DescriptorCurveStyle = styled(BadgeStyle)<{
  $variant?: OPERATOR_TYPE;
}>`
  font-weight: 700;
  color: var(--lido-color-foreground);
  padding-inline: 0px;

  ${({ $variant }) => ($variant ? (CURVE_VARIANTS[$variant] ?? '') : '')}
`;
