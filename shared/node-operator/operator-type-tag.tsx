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
import { CSSProperties, FC, MouseEventHandler } from 'react';
import styled from 'styled-components';
import { CURVE_GRADIENTS } from './curve-badge/styles';

export type OperatorTypeTagProps = {
  type: DisplayOperatorType;
  full?: boolean;
  tooltip?: boolean;
  disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>;
  'data-testid'?: string;
};

const ICS_GRADIENT = 'linear-gradient(60.6deg, #08d1ff 7.1%, #88f493 127.77%)';
const ICS_FULL_GRADIENT =
  'linear-gradient(19.85deg, #08d1ff 7.1%, #88f493 127.77%)';
const IDVTC_GRADIENT = 'linear-gradient(10.45deg, #b98bff 0%, #ff7fc3 100%)';
const IDVTC_GLOW = 'linear-gradient(10.45deg, #c4a8ff 0%, #f7a3cc 100%)';

const isCurated = (type: DisplayOperatorType) =>
  type !== CUSTOM_CURVE && OPERATOR_TYPE_INFO[type].module === MODULE_NAME.CM;

const getGradients = (
  type: DisplayOperatorType,
  full: boolean,
): { fill: string; glow: string } => {
  switch (type) {
    case OPERATOR_TYPE.CSM_ICS:
      return {
        fill: full ? ICS_FULL_GRADIENT : ICS_GRADIENT,
        glow: ICS_GRADIENT,
      };
    case OPERATOR_TYPE.CSM_IDVTC:
      return { fill: IDVTC_GRADIENT, glow: IDVTC_GLOW };
    default:
      return { fill: CURVE_GRADIENTS[type], glow: CURVE_GRADIENTS[type] };
  }
};

const TagStyle = styled(Tag)`
  && {
    justify-content: center;
    flex-shrink: 0;
    max-width: 100%;
  }
`;

export const OperatorTypeTag: FC<OperatorTypeTagProps> = ({
  type,
  full = false,
  tooltip = false,
  disabled,
  onClick,
  'data-testid': testId,
}) => {
  const { short, name } = OPERATOR_TYPE_METADATA[type];
  const gradients = isCurated(type) ? undefined : getGradients(type, full);

  const style = gradients && {
    '--lido-app-ui-tag-background': gradients.fill,
    '--lido-app-ui-tag-color': '#fff',
    ...(!full && { '--lido-app-ui-tag-glow': gradients.glow }),
  };

  const tag = (
    <TagStyle
      variant={gradients ? 'custom' : 'action'}
      style={style as CSSProperties | undefined}
      disabled={disabled}
      onClick={onClick}
      dataTestId={{ root: testId }}
    >
      {full ? name : short}
    </TagStyle>
  );

  return tooltip && !full ? <Tooltip content={name}>{tag}</Tooltip> : tag;
};
