import { Theme } from '@lidofinance/lido-ui';
import styled, { css } from 'styled-components';
import { BadgeStyle } from '../role-badge/styles';
import { OPERATOR_TYPE } from 'consts';

type InjectedProps = {
  theme: Theme;
};

const CURVE_VARIANTS = {
  [OPERATOR_TYPE.VETTED]: css<InjectedProps>`
    background: radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%),
      rgba(215, 220, 227, 0.56);
  `,
  [OPERATOR_TYPE.CUSTOM]: css<InjectedProps>`
    background: linear-gradient(93deg, #08d1ff -23.5%, #88f493 121.99%);
  `,
  [OPERATOR_TYPE.DEFAULT]: css`
    display: none;
  `,
} as const;

export const DescriptorCurveStyle = styled(BadgeStyle)<{
  $variant: OPERATOR_TYPE;
}>`
  font-weight: 700;
  color: var(--lido-color-foreground);

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;
