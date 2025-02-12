import { Theme } from '@lidofinance/lido-ui';
import { CURVE_TYPE } from 'shared/hooks';
import styled, { css } from 'styled-components';
import { BadgeStyle } from '../role-badge/styles';

type InjectedProps = {
  theme: Theme;
};

const CURVE_VARIANTS = {
  EA: css<InjectedProps>`
    background: radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%),
      rgba(215, 220, 227, 0.56);
  `,
  CUSTOM: css<InjectedProps>`
    background: linear-gradient(93deg, #08d1ff -23.5%, #88f493 121.99%);
  `,
  DEFAULT: css`
    display: none;
  `,
};

export const DescriptorCurveStyle = styled(BadgeStyle)<{
  $variant: CURVE_TYPE;
}>`
  font-weight: 700;
  color: var(--lido-color-foreground);

  ${({ $variant }) => ($variant ? CURVE_VARIANTS[$variant] : '')}
`;
