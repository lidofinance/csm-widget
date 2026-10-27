import {
  MODULE_NAME,
  OPERATOR_TYPE,
  OPERATOR_TYPE_INFO,
} from '@lidofinance/lido-csm-sdk';
import { Tag, Tooltip } from '@lidofinance/lido-app-ui';
import {
  CUSTOM_CURVE,
  DisplayOperatorType,
  OPERATOR_TYPE_METADATA,
} from 'consts';
import { FC } from 'react';
import styled, { css } from 'styled-components';
import { CURVE_VARIANTS } from './curve-badge/styles';

export type OperatorTypeTagProps = {
  type: DisplayOperatorType;
  full?: boolean;
  tooltip?: boolean;
};

type Gradient = ReturnType<typeof css>;

const ICS_GRADIENT = css`
  background: linear-gradient(60.6deg, #08d1ff 7.1%, #88f493 127.77%);
`;
const ICS_FULL_GRADIENT = css`
  background: linear-gradient(19.85deg, #08d1ff 7.1%, #88f493 127.77%);
`;
const IDVTC_GRADIENT = css`
  background: linear-gradient(10.45deg, #b98bff 0%, #ff7fc3 100%);
`;
const IDVTC_GLOW = css`
  background: linear-gradient(10.45deg, #c4a8ff 0%, #f7a3cc 100%);
`;

const isCurated = (type: DisplayOperatorType) =>
  type !== CUSTOM_CURVE && OPERATOR_TYPE_INFO[type].module === MODULE_NAME.CM;

const getGradients = (
  type: DisplayOperatorType,
  full: boolean,
): { fill: Gradient; glow: Gradient } => {
  switch (type) {
    case OPERATOR_TYPE.CSM_ICS:
      return {
        fill: full ? ICS_FULL_GRADIENT : ICS_GRADIENT,
        glow: ICS_GRADIENT,
      };
    case OPERATOR_TYPE.CSM_IDVTC:
      return { fill: IDVTC_GRADIENT, glow: IDVTC_GLOW };
    default:
      return { fill: CURVE_VARIANTS[type], glow: CURVE_VARIANTS[type] };
  }
};

const GlowStyle = styled.span<{ $glow?: Gradient }>`
  position: relative;
  isolation: isolate;
  display: inline-flex;
  max-width: 100%;
  flex-shrink: 0;

  ${({ $glow }) =>
    $glow &&
    css`
      &::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        border-radius: 8px;
        filter: blur(8px);
        opacity: 0.5;
        ${$glow}
      }
    `}
`;

const TagStyle = styled(Tag)<{ $fill?: Gradient }>`
  && {
    justify-content: center;
  }

  ${({ $fill }) =>
    $fill &&
    css`
      && {
        color: #fff;
        ${$fill}
        background-origin: border-box;
      }
    `}
`;

export const OperatorTypeTag: FC<OperatorTypeTagProps> = ({
  type,
  full = false,
  tooltip = false,
}) => {
  const { short, name } = OPERATOR_TYPE_METADATA[type];
  const curated = isCurated(type);
  const gradients = curated ? undefined : getGradients(type, full);

  const tag = (
    <GlowStyle $glow={full ? undefined : gradients?.glow}>
      <TagStyle
        variant={curated ? 'action' : 'default'}
        $fill={gradients?.fill}
      >
        {full ? name : short}
      </TagStyle>
    </GlowStyle>
  );

  return tooltip && !full ? <Tooltip content={name}>{tag}</Tooltip> : tag;
};
