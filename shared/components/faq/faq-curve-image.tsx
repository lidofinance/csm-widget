import { OPERATOR_TYPE } from '@lidofinance/lido-csm-sdk';
import { ThemeName, useThemeToggle } from '@lidofinance/lido-ui';
import Image from 'next/image';
import { FC } from 'react';
import { useCurrentCurve, useModuleOperatorType } from 'shared/hooks';

import curve0x02Dark from 'faq/images/curve-0x02-dark.png';
import curve0x02 from 'faq/images/curve-0x02.png';
import curveDefDark from 'faq/images/curve-def-dark.png';
import curveDef from 'faq/images/curve-def.png';
import curveIcsDark from 'faq/images/curve-ics-dark.png';
import curveIdvtcDark from 'faq/images/curve-idvtc-dark.png';
import curveIdvtc from 'faq/images/curve-idvtc.png';
import curveIcs from 'faq/images/curve-ics.png';

const isIcs = (type?: OPERATOR_TYPE) =>
  !!type &&
  ([OPERATOR_TYPE.CSM_ICS, OPERATOR_TYPE.CSM_LEA] as OPERATOR_TYPE[]).includes(
    type,
  );

const pickImages = (type?: OPERATOR_TYPE) => {
  if (type === OPERATOR_TYPE.CSM2_DEF) return [curve0x02, curve0x02Dark];
  if (type === OPERATOR_TYPE.CSM_IDVTC) return [curveIdvtc, curveIdvtcDark];
  if (isIcs(type)) return [curveIcs, curveIcsDark];
  return [curveDef, curveDefDark];
};

export const FaqCurveImage: FC<{ type?: OPERATOR_TYPE }> = ({
  type: _type,
}) => {
  const curveType = useModuleOperatorType(useCurrentCurve());
  const type = _type ?? curveType;
  const { themeName } = useThemeToggle();
  const isDark = themeName === ThemeName.dark;

  const [img, imgDark] = pickImages(type);

  return <Image src={isDark ? imgDark : img} alt="Bond Curve" />;
};
