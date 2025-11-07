import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { BadgeStyle } from '../role-badge/styles';
import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';

type InjectedProps = {
  theme: Theme;
};

export const CURVE_VARIANTS = {
  [OPERATOR_TYPE.DEF]: css`
    background: linear-gradient(78deg, #304352 -49.42%, #d7d2cc 157.87%),
      linear-gradient(79deg, #00a3ff -9.53%, #2238ff 202.88%);
  `,
  [OPERATOR_TYPE.LEA]: css<InjectedProps>`
    background: radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%),
      rgba(215, 220, 227, 0.56);
  `,
  [OPERATOR_TYPE.ICS]: css`
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
} as const;

export const DescriptorCurveStyle = styled(BadgeStyle)<{
  $variant?: OPERATOR_TYPE;
}>`
  font-weight: 700;
  color: var(--lido-color-foreground);
  padding-inline: 0px;

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;
