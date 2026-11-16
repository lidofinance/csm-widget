import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { CUSTOM_CURVE, DisplayOperatorType } from 'consts';
import styled, { css } from 'styled-components';

const BadgeStyle = styled.span`
  border-radius: var(--lido-app-ui-border-radius-sm);
  min-width: 28px;
  height: 28px;
  font-size: var(--lido-app-ui-font-size-label);

  display: inline-flex;
  justify-content: center;
  align-items: center;

  text-transform: capitalize;
`;

export const CURVE_GRADIENTS: Record<DisplayOperatorType, string> = {
  [OPERATOR_TYPE.CSM_DEF]: `linear-gradient(78deg, #304352 -49.42%, #d7d2cc 157.87%),
      linear-gradient(79deg, #00a3ff -9.53%, #2238ff 202.88%)`,
  [OPERATOR_TYPE.CSM2_DEF]:
    'linear-gradient(120deg, #2381e0 2.5%, #002e5d 100.1%)',
  [OPERATOR_TYPE.CSM_LEA]: `radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%),
      rgba(215, 220, 227, 0.56)`,
  [OPERATOR_TYPE.CSM_ICS]: `linear-gradient(69deg, #08d1ff 7.1%, #88f493 127.77%),
      radial-gradient(
        132.01% 229.66% at 51.78% 123.98%,
        #ef81f9 0%,
        rgba(249, 129, 183, 0) 100%
      ),
      linear-gradient(97deg, #00a3ff 36.36%, #2238ff 99.58%)`,
  [OPERATOR_TYPE.CSM_IDVTC]:
    'linear-gradient(91deg, #c4a8ff 2.95%, #f7a3cc 103.56%)',
  [CUSTOM_CURVE]: 'linear-gradient(93deg, #08d1ff -23.5%, #88f493 121.99%)',
  [OPERATOR_TYPE.CM_PO]: '#273852',
  [OPERATOR_TYPE.CM_PTO]: '#273852',
  [OPERATOR_TYPE.CM_DO]: '#273852',
  [OPERATOR_TYPE.CM_IODC]: '#273852',
  [OPERATOR_TYPE.CM_IODCP]: '#273852',
  [OPERATOR_TYPE.CM_EEO]: '#273852',
  [OPERATOR_TYPE.CM_PGO]: '#273852',
};

export const CURVE_VARIANTS = Object.fromEntries(
  Object.entries(CURVE_GRADIENTS).map(([type, gradient]) => [
    type,
    css`
      background: ${gradient};
    `,
  ]),
) as Record<DisplayOperatorType, ReturnType<typeof css>>;

export const DescriptorCurveStyle = styled(BadgeStyle)<{
  $variant?: DisplayOperatorType;
  $inline?: boolean;
}>`
  font-weight: 700;
  color: #fff;
  padding-inline: ${({ $inline }) => ($inline ? '6px' : '0px')};
  width: max-content;

  ${({ $variant }) => ($variant ? (CURVE_VARIANTS[$variant] ?? '') : '')}
`;
