import { getOperatorType } from 'modules/web3';
import Image from 'next/image';
import { FC } from 'react';
import { useCurrentCurveId } from 'shared/hooks';

import curvePls from 'faq/images/curve-pls.png';
import curveIcs from 'faq/images/curve-ics.png';
import curveIcsDark from 'faq/images/curve-ics-dark.png';
import curvePlsDark from 'faq/images/curve-pls-dark.png';
import { OPERATOR_TYPE } from 'consts';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';

const isIcs = (type?: OPERATOR_TYPE) =>
  !!type && [OPERATOR_TYPE.ICS, OPERATOR_TYPE.LEA].includes(type);

export const FaqCurveImage: FC<{ type?: OPERATOR_TYPE }> = ({
  type: _type,
}) => {
  const curveId = useCurrentCurveId();
  const type = _type ?? getOperatorType(curveId);
  const { themeName } = useThemeToggle();
  const isDark = themeName === ThemeName.dark;

  const img = isIcs(type) ? curveIcs : curvePls;
  const imgDark = isIcs(type) ? curveIcsDark : curvePlsDark;

  return <Image src={isDark ? imgDark : img} alt="Bond Curve" />;
};
