import {
  CSM_OPERATOR_TYPE,
  type OperatorType,
} from '@lidofinance/lido-csm-sdk';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import { getOperatorTypeForCurveId } from 'consts';
import Image from 'next/image';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';

import curveIcsDark from 'faq/images/curve-ics-dark.png';
import curveIcs from 'faq/images/curve-ics.png';
import curveDefDark from 'faq/images/curve-def-dark.png';
import curveDef from 'faq/images/curve-def.png';

const isIcs = (type?: OperatorType) =>
  !!type &&
  [CSM_OPERATOR_TYPE.ICS, CSM_OPERATOR_TYPE.LEA].includes(
    type as CSM_OPERATOR_TYPE,
  );

export const FaqCurveImage: FC<{ type?: OperatorType }> = ({ type: _type }) => {
  const curveId = useCurrentCurveId();
  const type = _type ?? getOperatorTypeForCurveId(curveId);
  const { themeName } = useThemeToggle();
  const isDark = themeName === ThemeName.dark;

  const img = isIcs(type) ? curveIcs : curveDef;
  const imgDark = isIcs(type) ? curveIcsDark : curveDefDark;

  return <Image src={isDark ? imgDark : img} alt="Bond Curve" />;
};
