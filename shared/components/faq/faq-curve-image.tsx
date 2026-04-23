import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import Image from 'next/image';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';

import { getModuleOperatorType } from 'consts';
import curveDefDark from 'faq/images/curve-def-dark.png';
import curveDef from 'faq/images/curve-def.png';
import curveIcsDark from 'faq/images/curve-ics-dark.png';
import curveIcs from 'faq/images/curve-ics.png';

const isIcs = (type?: OPERATOR_TYPE) =>
  !!type &&
  ([OPERATOR_TYPE.CSM_ICS, OPERATOR_TYPE.CSM_LEA] as OPERATOR_TYPE[]).includes(
    type,
  );

export const FaqCurveImage: FC<{ type?: OPERATOR_TYPE }> = ({
  type: _type,
}) => {
  const curveId = useCurrentCurveId();
  const type = _type ?? getModuleOperatorType(curveId);
  const { themeName } = useThemeToggle();
  const isDark = themeName === ThemeName.dark;

  const img = isIcs(type) ? curveIcs : curveDef;
  const imgDark = isIcs(type) ? curveIcsDark : curveDefDark;

  return <Image src={isDark ? imgDark : img} alt="Bond Curve" />;
};
